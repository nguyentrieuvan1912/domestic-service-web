import { createElement } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { RichNode } from '../../api/blog'
import { safeBlogUrl, youtubeEmbed } from './blogUrls'

function renderNode(node: RichNode, index: number): ReactNode {
  const attrs = node.attrs || {}
  const children = node.content?.map(renderNode)
  const style: CSSProperties = ['left', 'center', 'right', 'justify'].includes(String(attrs.textAlign)) ? { textAlign: attrs.textAlign as CSSProperties['textAlign'] } : {}
  if (node.type === 'text') {
    let content: ReactNode = node.text || ''
    for (const mark of node.marks || []) {
      const values = mark.attrs || {}
      if (['bold', 'italic', 'underline', 'strike', 'code'].includes(mark.type)) content = createElement(({ bold: 'strong', italic: 'em', underline: 'u', strike: 's', code: 'code' } as Record<string, string>)[mark.type], null, content)
      if (mark.type === 'link') content = <a href={safeBlogUrl(values.href, true)} target="_blank" rel="noopener noreferrer">{content}</a>
      if (mark.type === 'textStyle') {
        const textStyle: CSSProperties = {}
        if (/^(12|14|16|18|20|24|28|32|36|48)px$/.test(String(values.fontSize))) textStyle.fontSize = String(values.fontSize)
        if (['Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Tahoma', 'Plus Jakarta Sans'].includes(String(values.fontFamily))) textStyle.fontFamily = String(values.fontFamily)
        if (/^#[a-f0-9]{6}$/i.test(String(values.color))) textStyle.color = String(values.color)
        if (/^#[a-f0-9]{6}$/i.test(String(values.backgroundColor))) textStyle.backgroundColor = String(values.backgroundColor)
        if (['1', '1.2', '1.5', '1.8', '2'].includes(String(values.lineHeight))) textStyle.lineHeight = String(values.lineHeight)
        content = <span style={textStyle}>{content}</span>
      }
    }
    return <span key={index}>{content}</span>
  }
  switch (node.type) {
    case 'doc': return <div key={index}>{children}</div>
    case 'paragraph': return <p key={index} style={style}>{children?.length ? children : <br />}</p>
    case 'heading': return createElement(`h${Math.min(3, Math.max(1, Number(attrs.level) || 2))}`, { key: index, style }, children)
    case 'bulletList': return <ul key={index}>{children}</ul>
    case 'orderedList': return <ol key={index} start={Number(attrs.start) || 1}>{children}</ol>
    case 'listItem': return <li key={index}>{children}</li>
    case 'blockquote': return <blockquote key={index}>{children}</blockquote>
    case 'hardBreak': return <br key={index} />
    case 'horizontalRule': return <hr key={index} />
    case 'codeBlock': return <pre key={index}><code>{children}</code></pre>
    case 'image': return safeBlogUrl(attrs.src) && <figure key={index}><img src={safeBlogUrl(attrs.src)} alt={String(attrs.alt || '')} title={String(attrs.title || '')} loading="lazy" />{attrs.title ? <figcaption>{String(attrs.title)}</figcaption> : null}</figure>
    case 'video': return safeBlogUrl(attrs.src) && <figure key={index}><video src={safeBlogUrl(attrs.src)} controls preload="metadata" playsInline /><figcaption>{String(attrs.title || '')}</figcaption></figure>
    case 'youtube': return youtubeEmbed(attrs.src) && <div key={index} className="blog-video"><iframe src={youtubeEmbed(attrs.src)} title="Video trong bài viết" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
    default: return null
  }
}
export default function ArticleContent({ document }: { document: RichNode }) {
  return <div className="article-content">{renderNode(document, 0)}</div>
}
