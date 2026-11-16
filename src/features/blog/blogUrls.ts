export function safeBlogUrl(value: unknown, internal = false): string | undefined {
  const url = String(value || '')
  if (internal && url.startsWith('/') && !url.startsWith('//') && !url.includes('\\')) return url
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? url : undefined } catch { return undefined }
}
export function youtubeEmbed(value: unknown) {
  try {
    const url = new URL(String(value))
    if (!['www.youtube.com', 'youtube.com', 'youtu.be', 'www.youtube-nocookie.com'].includes(url.hostname)) return undefined
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') || url.pathname.split('/').at(-1)
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : undefined
  } catch { return undefined }
}
