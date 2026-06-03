/** Pure helper — safe for server serialization only. */

export function getMediaUrl(
  media: { url?: string | null } | string | number | null | undefined,
): string | null {
  if (!media || typeof media === 'string' || typeof media === 'number') return null
  return media.url ?? null
}
