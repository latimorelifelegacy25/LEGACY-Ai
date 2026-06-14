export function captureUtms() {
  if (typeof window === 'undefined') return {} as Record<string, string>
  
  const p = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'referrer']
  const out: Record<string, string> = {}
  
  keys.forEach(k => {
    const v = p.get(k)
    if (v) out[k] = v
  })
  
  return out
}

export function getUtmString() {
  const utms = captureUtms()
  return new URLSearchParams(utms).toString()
}