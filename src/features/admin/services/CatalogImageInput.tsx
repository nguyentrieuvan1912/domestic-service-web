import { useId } from 'react'

export type ImageSize = { width: number; height: number }

export const SERVICE_IMAGE_SIZE = { width: 1200, height: 675 }
export const SPLIT_BANNER_SIZE = { width: 660, height: 768 }
export const FULL_BANNER_SIZE = { width: 1200, height: 500 }

export async function prepareCatalogImage(file: File, { width, height }: ImageSize) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Chọn ảnh JPG, PNG hoặc WebP.')
  if (file.size > 15 * 1024 * 1024) throw new Error('Tệp ảnh gốc không được vượt quá 15 MB.')
  const image = await createImageBitmap(file).catch(() => { throw new Error('Không đọc được tệp ảnh đã chọn.') })
  try {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Trình duyệt chưa xử lý được ảnh.')
    const scale = Math.max(width / image.width, height / image.height)
    const drawnWidth = image.width * scale
    const drawnHeight = image.height * scale
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, (width - drawnWidth) / 2, (height - drawnHeight) / 2, drawnWidth, drawnHeight)
    return canvas.toDataURL('image/jpeg', 0.88)
  } finally {
    image.close()
  }
}

export function CatalogImageInput({ size, disabled, onPick }: { size: ImageSize; disabled: boolean; onPick: (file: File) => void }) {
  const hintId = useId()
  return <div className="space-y-2">
    <label className="block space-y-2 text-sm font-semibold text-slate-800">
      <span>Chọn ảnh từ thiết bị</span>
      <input aria-describedby={hintId} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled}
        className="block w-full rounded-lg border border-slate-300 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-800 disabled:opacity-50"
        onChange={event => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (file) onPick(file)
        }} />
    </label>
    <p id={hintId} className="text-sm text-slate-600">
      Kích thước thiết kế <strong>{size.width} × {size.height} px</strong>. JPG, PNG hoặc WebP, tối đa 15 MB.
      Ảnh lệch tỉ lệ sẽ được cắt ở giữa theo bản xem trước.
    </p>
  </div>
}
