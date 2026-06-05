/** Pure helper — safe for server serialization only. */

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

/**
 * Payload'dan gelen `media` alanını güvenli bir URL string'ine dönüştürür.
 *
 * Payload, staticDir:'media' ayarıyla görselleri /media/... yolunda sunar.
 * next/image bu relative path'i kabul etmeyebilir; SERVER_URL prefix eklenir.
 *
 * - Populate edilmiş obje → media.url → tam URL
 * - Ham string URL        → doğrudan döner (harici URL desteği)
 * - Sadece ID (number)    → null (populate edilmemişse URL yok)
 * - null / undefined      → null
 */
export function getMediaUrl(
  media: { url?: string | null } | string | number | null | undefined,
): string | null {
  if (!media) return null
  if (typeof media === 'string') return absolutify(media)
  if (typeof media === 'number') return null
  return media.url ? absolutify(media.url) : null
}

/**
 * /media/... gibi göreceli Payload yollarını tam URL'e çevirir.
 * Zaten http(s) ile başlıyorsa dokunmaz.
 */
function absolutify(url: string): string {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // /media/... → http://localhost:3000/media/...
  return `${SERVER}${url.startsWith('/') ? '' : '/'}${url}`
}

