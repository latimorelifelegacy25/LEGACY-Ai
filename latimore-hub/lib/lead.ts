export function ensureLeadSessionId() {
  if (typeof window === 'undefined') return ''
  
  const k = 'lead_session_id'
  let v = localStorage.getItem(k)
  
  if (!v) { 
    v = crypto.randomUUID()
    localStorage.setItem(k, v) 
  }
  
  return v
}

export function getLeadSessionId() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('lead_session_id') || ''
}