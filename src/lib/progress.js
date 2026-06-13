// Tiny cookie-backed store for "which concepts has this visitor explored".
// We keep a comma-separated list of concept ids in a single cookie so progress
// survives reloads and return visits for a year.

const COOKIE = 'js-anim-progress'
const MAX_AGE = 60 * 60 * 24 * 365 // one year, in seconds

export function loadVisited() {
  try {
    const match = document.cookie.match(/(?:^|;\s*)js-anim-progress=([^;]*)/)
    if (!match) return new Set()
    const ids = decodeURIComponent(match[1]).split(',').filter(Boolean)
    return new Set(ids)
  } catch {
    return new Set()
  }
}

export function saveVisited(set) {
  try {
    const value = encodeURIComponent([...set].join(','))
    document.cookie = `${COOKIE}=${value}; max-age=${MAX_AGE}; path=/; samesite=lax`
  } catch {
    /* ignore — cookies may be disabled */
  }
}
