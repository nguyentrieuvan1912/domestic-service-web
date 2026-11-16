import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Youtube from '@tiptap/extension-youtube'
import { blogCategories, blogMediaCapabilities, blogSlug, saveBlog, uploadBlogMedia } from '../../api/blog'
import type { BlogDraft, BlogStatus } from '../../api/blog'
import ArticleContent from './ArticleContent'
import { safeBlogUrl, youtubeEmbed } from './blogUrls'

const Video = Node.create({
  name: 'video', group: 'block', atom: true,
  addAttributes() { return { src: { default: null }, title: { default: null } } },
  parseHTML() { return [{ tag: 'video[src]' }] },
  renderHTML({ HTMLAttributes }) { return ['video', mergeAttributes(HTMLAttributes, { controls: true, preload: 'metadata', playsinline: true })] },
})
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
const buttonClass = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40'

export default function BlogStudio({ initial, onClose, onSaved }: { initial: BlogDraft; onClose: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState(initial)
  const [document, setDocument] = useState(initial.document)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [preview, setPreview] = useState(false)
  const [mediaEnabled, setMediaEnabled] = useState(false)
  const [mediaError, setMediaError] = useState('')
  const [insert, setInsert] = useState<'link' | 'image' | 'video' | 'youtube' | null>(null)
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [uploadTarget, setUploadTarget] = useState<'cover' | 'content'>('content')
  const fileInput = useRef<HTMLInputElement>(null)
  const locked = useRef(false)
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: { openOnClick: false } }), Image, Video, TextAlign.configure({ types: ['heading', 'paragraph'] }), TextStyleKit, Youtube.configure({ nocookie: true })],
    content: initial.document,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: 'article-content studio-document min-h-[620px] outline-none', 'aria-label': 'Nội dung bài viết' } },
    onUpdate: ({ editor: current }) => { setDocument(current.getJSON()); setDirty(true); setNotice('') },
  })
  useEffect(() => { editor?.setEditable(!saving && !uploading, false) }, [editor, saving, uploading])
  useEffect(() => {
    let active = true
    void blogMediaCapabilities().then(data => { if (active) setMediaEnabled(data.enabled) }).catch(cause => { if (active) setMediaError(cause.message) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const update = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value })); setDirty(true); setNotice('')
  }
  const close = () => { if (!saving && !uploading && (!dirty || window.confirm('Bài viết có thay đổi chưa lưu. Đóng studio và bỏ các thay đổi này?'))) onClose() }
  const save = async (status: BlogStatus) => {
    if (locked.current || uploading || !editor) return
    locked.current = true; setSaving(true); setError(''); setNotice('')
    try {
      const saved = await saveBlog({ ...draft, document: editor.getJSON(), status })
      setDraft(saved); setDirty(false); onSaved()
      setNotice(status === 'PUBLISHED' ? 'Đã lưu và xuất bản lên trang Blog.' : status === 'ARCHIVED' ? 'Đã ẩn bài khỏi trang Blog.' : 'Đã lưu bản nháp vào hệ thống.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa lưu được bài viết.') }
    finally { locked.current = false; setSaving(false) }
  }
  const toolbar = (label: string, content: string, action: () => void, active = false) => <button key={label} type="button" title={label} aria-label={label} aria-pressed={active} disabled={saving || uploading} onMouseDown={event => event.preventDefault()} onClick={action} className={`studio-tool ${active ? 'studio-tool-active' : ''}`}>{content}</button>
  const showInsert = (kind: NonNullable<typeof insert>) => { setInsert(kind); setUrl(''); setCaption(''); setError('') }
  const insertUrl = () => {
    if (!editor || !insert) return
    const safe = safeBlogUrl(url, insert === 'link')
    if (!safe || insert === 'youtube' && !youtubeEmbed(safe)) { setError('Nhập đường dẫn HTTPS hợp lệ; video YouTube cần đường dẫn video đúng.'); return }
    if (insert === 'link') editor.chain().focus().extendMarkRange('link').setLink({ href: safe }).run()
    if (insert === 'image') editor.chain().focus().setImage({ src: safe, alt: caption, title: caption }).run()
    if (insert === 'video') editor.chain().focus().insertContent({ type: 'video', attrs: { src: safe, title: caption } }).run()
    if (insert === 'youtube') editor.chain().focus().setYoutubeVideo({ src: safe }).run()
    setInsert(null); setDirty(true)
  }
  const chooseFile = (target: 'cover' | 'content') => { setUploadTarget(target); if (fileInput.current) { fileInput.current.accept = target === 'cover' ? 'image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime'; fileInput.current.click() } }
  const upload = async (file?: File) => {
    if (!file || !editor || uploading) return
    if (uploadTarget === 'cover' && !file.type.startsWith('image/')) { setError('Ảnh bìa cần là tệp hình ảnh.'); return }
    setUploading(true); setError('')
    try {
      const asset = await uploadBlogMedia(file)
      if (uploadTarget === 'cover') update('coverUrl', asset.url)
      else if (asset.type === 'image') editor.chain().focus().setImage({ src: asset.url, alt: file.name.replace(/\.[^.]+$/, '') }).run()
      else editor.chain().focus().insertContent({ type: 'video', attrs: { src: asset.url, title: file.name } }).run()
      setDirty(true)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa tải được tệp.') }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = '' }
  }
  return <div className="fixed inset-0 z-[60] flex h-dvh flex-col bg-[#eef2ef] text-slate-900">
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:px-8"><div className="flex items-center gap-3"><button type="button" onClick={close} disabled={saving || uploading} className={buttonClass}>← Quản lý bài viết</button><div><p className="text-xs font-bold tracking-[0.18em] text-emerald-700">CLEANMASTER STUDIO</p><p className="mt-1 text-xs text-slate-500">{dirty ? 'Có thay đổi chưa lưu' : draft.id ? 'Đã lưu trên hệ thống' : 'Bài viết mới'}</p></div></div><div className="flex flex-wrap items-center gap-2"><button type="button" className={buttonClass} onClick={() => setPreview(value => !value)}>{preview ? '✎ Soạn thảo' : '◉ Xem trước'}</button><button type="button" className={buttonClass} disabled={saving || uploading} onClick={() => void save('DRAFT')}>{draft.status === 'PUBLISHED' ? 'Chuyển về nháp' : 'Lưu nháp'}</button><button type="button" disabled={saving || uploading} onClick={() => void save('PUBLISHED')} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50">{saving ? 'Đang lưu…' : 'Xuất bản bài viết ↗'}</button></div></header>
    {(error || notice || uploading) && <div role={error ? 'alert' : 'status'} className={`shrink-0 px-6 py-2 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{error || (uploading ? 'Đang tải và xác minh tệp trên Cloudinary…' : notice)}</div>}
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      <main className="min-w-0 flex-1 lg:overflow-y-auto">
        {!preview && editor && <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur">
          <select disabled={saving || uploading} aria-label="Kiểu đoạn văn" className="studio-select" value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : '0'} onChange={event => { const level = Number(event.target.value); if (level) editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run(); else editor.chain().focus().setParagraph().run() }}><option value="0">Đoạn văn</option><option value="1">Tiêu đề lớn</option><option value="2">Tiêu đề mục</option><option value="3">Tiêu đề nhỏ</option></select>
          <select disabled={saving || uploading} aria-label="Phông chữ" className="studio-select" value={editor.getAttributes('textStyle').fontFamily || ''} onChange={event => { if (event.target.value) editor.chain().focus().setFontFamily(event.target.value).run(); else editor.chain().focus().unsetFontFamily().run() }}><option value="">Phông mặc định</option>{['Plus Jakarta Sans', 'Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Tahoma'].map(font => <option key={font}>{font}</option>)}</select>
          <select disabled={saving || uploading} aria-label="Cỡ chữ" className="studio-select" value={editor.getAttributes('textStyle').fontSize || ''} onChange={event => { if (event.target.value) editor.chain().focus().setFontSize(event.target.value).run(); else editor.chain().focus().unsetFontSize().run() }}><option value="">Cỡ chữ</option>{[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(size => <option key={size} value={`${size}px`}>{size}</option>)}</select>
          {toolbar('In đậm', 'B', () => { editor.chain().focus().toggleBold().run() }, editor.isActive('bold'))}{toolbar('In nghiêng', 'I', () => { editor.chain().focus().toggleItalic().run() }, editor.isActive('italic'))}{toolbar('Gạch chân', 'U', () => { editor.chain().focus().toggleUnderline().run() }, editor.isActive('underline'))}{toolbar('Gạch ngang', 'S̶', () => { editor.chain().focus().toggleStrike().run() }, editor.isActive('strike'))}
          <label title="Màu chữ" className="studio-tool cursor-pointer">A<input aria-label="Màu chữ" type="color" disabled={saving || uploading} value={editor.getAttributes('textStyle').color || '#1e293b'} onChange={event => editor.chain().focus().setColor(event.target.value).run()} className="h-5 w-5 cursor-pointer border-0 bg-transparent" /></label>
          <label title="Màu nền chữ" className="studio-tool cursor-pointer">▰<input aria-label="Màu nền chữ" type="color" disabled={saving || uploading} value={editor.getAttributes('textStyle').backgroundColor || '#fef3c7'} onChange={event => editor.chain().focus().setBackgroundColor(event.target.value).run()} className="h-5 w-5 cursor-pointer border-0 bg-transparent" /></label>
          <span className="mx-1 h-6 border-l border-slate-200" />{(['left', 'center', 'right', 'justify'] as const).map((align, i) => toolbar(['Căn trái', 'Căn giữa', 'Căn phải', 'Căn đều'][i], ['≡←', '≡', '→≡', '☰'][i], () => { editor.chain().focus().setTextAlign(align).run() }, editor.isActive({ textAlign: align })))}
          <select disabled={saving || uploading} aria-label="Giãn dòng" className="studio-select" value={editor.getAttributes('textStyle').lineHeight || ''} onChange={event => { if (event.target.value) editor.chain().focus().setLineHeight(event.target.value).run(); else editor.chain().focus().unsetLineHeight().run() }}><option value="">Giãn dòng</option>{['1', '1.2', '1.5', '1.8', '2'].map(value => <option key={value}>{value}</option>)}</select>
          {toolbar('Danh sách dấu chấm', '• Danh sách', () => { editor.chain().focus().toggleBulletList().run() }, editor.isActive('bulletList'))}{toolbar('Danh sách đánh số', '1. Danh sách', () => { editor.chain().focus().toggleOrderedList().run() }, editor.isActive('orderedList'))}{toolbar('Trích dẫn', '❝', () => { editor.chain().focus().toggleBlockquote().run() }, editor.isActive('blockquote'))}{toolbar('Đường phân cách', '―', () => { editor.chain().focus().setHorizontalRule().run() })}
          {toolbar('Chèn liên kết', '↗ Liên kết', () => showInsert('link'))}{toolbar('Bỏ liên kết', '⌫ Link', () => { editor.chain().focus().unsetLink().run() })}{toolbar('Chèn ảnh bằng đường dẫn', '▧ Ảnh', () => showInsert('image'))}{toolbar('Chèn video bằng đường dẫn', '▷ Video', () => showInsert('video'))}{toolbar('Nhúng YouTube', '▶ YouTube', () => showInsert('youtube'))}
          <button type="button" disabled={!mediaEnabled || uploading || saving} className="studio-tool" onClick={() => chooseFile('content')}>↑ Tải ảnh/video</button>
          {toolbar('Hoàn tác', '↶', () => { editor.chain().focus().undo().run() })}{toolbar('Làm lại', '↷', () => { editor.chain().focus().redo().run() })}{toolbar('Xóa định dạng', 'Tx', () => { editor.chain().focus().unsetAllMarks().clearNodes().run() })}
        </div>}
        <div className="mx-auto max-w-4xl p-4 sm:p-8"><div className="min-h-[700px] rounded-xl bg-white px-6 py-10 shadow-sm ring-1 ring-slate-200 sm:px-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{blogCategories[draft.category]}</p><h1 className="mb-5 mt-4 break-words text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">{draft.title || 'Tiêu đề bài viết của bạn'}</h1><p className="mb-7 text-lg leading-8 text-slate-500">{draft.excerpt || 'Thêm mô tả ngắn để giới thiệu câu chuyện với người đọc.'}</p>{draft.coverUrl && safeBlogUrl(draft.coverUrl) && <img src={draft.coverUrl} alt={draft.title} className="mb-8 aspect-[16/9] w-full rounded-xl object-cover" />}
          {preview ? <ArticleContent document={document} /> : <EditorContent editor={editor} />}
        </div><p className="mt-4 text-center text-xs text-slate-500">Bản xem trước dùng cùng cách hiển thị với trang bài viết công khai.</p></div>
      </main>
      <aside className="w-full shrink-0 border-l border-slate-200 bg-white p-5 lg:w-80 lg:overflow-y-auto"><fieldset disabled={saving || uploading} className="space-y-5"><div><h2 className="font-bold">Thiết lập bài viết</h2><p className="mt-1 text-xs leading-5 text-slate-500">Hoàn thiện thông tin trước khi xuất bản.</p></div>
        <label className="studio-field">Tiêu đề *<input value={draft.title} maxLength={240} onChange={event => { update('title', event.target.value); if (!draft.id && (!draft.slug || draft.slug === blogSlug(draft.title))) update('slug', blogSlug(event.target.value)) }} className={inputClass} placeholder="Một câu chuyện hữu ích…" /></label>
        <label className="studio-field">Đường dẫn *<input value={draft.slug} maxLength={180} onChange={event => update('slug', blogSlug(event.target.value))} className={inputClass} placeholder="ten-bai-viet" /><span className="break-all text-xs font-normal text-slate-400">/blog/{draft.slug || 'ten-bai-viet'}</span></label>
        <label className="studio-field">Chuyên mục<select value={draft.category} onChange={event => update('category', event.target.value as BlogDraft['category'])} className={inputClass}>{Object.entries(blogCategories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="studio-field">Mô tả ngắn<textarea value={draft.excerpt} maxLength={800} rows={4} onChange={event => update('excerpt', event.target.value)} className={inputClass} placeholder="Giới thiệu nội dung cho thẻ bài viết…" /></label>
        <label className="studio-field">Tên tác giả<input value={draft.authorName} maxLength={160} onChange={event => update('authorName', event.target.value)} className={inputClass} /></label>
        <label className="studio-field">Ảnh bìa<input value={draft.coverUrl} onChange={event => update('coverUrl', event.target.value)} className={inputClass} placeholder="https://…" /></label><button type="button" disabled={!mediaEnabled || uploading || saving} onClick={() => chooseFile('cover')} className={`${buttonClass} w-full`}>↑ Tải ảnh bìa</button>
        <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">{mediaError || (!mediaEnabled ? 'Tải tệp chưa sẵn sàng. Bạn có thể dùng đường dẫn HTTPS cho ảnh/video.' : 'Ảnh JPG/PNG/WebP: tối đa 10 MB. Video MP4/WebM/MOV: tối đa 50 MB và 2 phút.')}<br />Tệp được lưu và xác minh trên Cloudinary.</div>
        {draft.id && draft.status === 'PUBLISHED' && <button type="button" disabled={saving || uploading} onClick={() => void save('ARCHIVED')} className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">Ẩn bài khỏi Blog</button>}
      </fieldset></aside>
    </div>
    <input ref={fileInput} type="file" accept={uploadTarget === 'cover' ? 'image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime'} className="hidden" onChange={event => void upload(event.target.files?.[0])} />
    {insert && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={event => { event.preventDefault(); insertUrl() }} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-lg font-bold">{({ link: 'Chèn liên kết', image: 'Chèn ảnh', video: 'Chèn video', youtube: 'Nhúng video YouTube' })[insert]}</h2><label className="studio-field">Đường dẫn<input autoFocus required type="text" value={url} onChange={event => setUrl(event.target.value)} className={inputClass} placeholder="https://…" /></label>{['image', 'video'].includes(insert) && <label className="studio-field">Mô tả / chú thích<input value={caption} onChange={event => setCaption(event.target.value)} maxLength={500} className={inputClass} /></label>}{error && <p className="text-sm text-red-600">{error}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={() => setInsert(null)} className={buttonClass}>Hủy</button><button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">Chèn vào bài</button></div></form></div>}
  </div>
}
