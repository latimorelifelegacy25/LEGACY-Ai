import { createClient } from '@supabase/supabase-js'

// Lazily constructed so module import (forced by Next.js's build-time page
// data collection for route handlers) never throws when env vars aren't
// configured - callers below already treat a missing client as a no-op.
function getUnifiedClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return null
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

// InterestType only captures 3 broad tracks (Velocity/Depth/Group), vs the
// unified schema's 7 specific funnels, so this mapping is necessarily lossy
// (e.g. mortgage-protection and living-benefits both collapse into "Velocity").
function interestTypeToFunnelSlug(interestType: string): string | null {
  switch (interestType) {
    case 'Velocity':
      return 'life-insurance-basics'
    case 'Depth':
      return 'retirement-annuities'
    case 'Group':
      return 'business-key-person'
    default:
      return null
  }
}

function inquiryStatusToLeadStatus(status: string): string {
  switch (status) {
    case 'New_Inquiry':
      return 'new'
    case 'Qualified':
      return 'nurturing'
    case 'Booked':
      return 'booked'
    case 'Closed_Won':
      return 'consulted'
    case 'Closed_Lost':
      return 'disqualified'
    default:
      return 'new'
  }
}

type SyncContact = {
  firstName?: string | null
  lastName?: string | null
  email: string
  phone?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmTerm?: string | null
  utmContent?: string | null
  referrer?: string | null
}

// Best-effort: mirrors a Contact/Inquiry write into the unified leads schema
// so Notion sync and funnel reporting see it too. Never throws - a failure
// here must not block the primary Prisma write the caller already committed.
export async function syncInquiryToUnifiedSchema(params: {
  inquiryId: string
  contact: SyncContact
  interestType: string
  status: string
  source?: string | null
}) {
  try {
    const supabaseAdmin = getUnifiedClient()
    if (!supabaseAdmin) return

    const { error } = await supabaseAdmin.from('leads').upsert(
      {
        first_name: params.contact.firstName || 'Unknown',
        last_name: params.contact.lastName,
        email: params.contact.email,
        phone: params.contact.phone,
        selected_funnel_slug: interestTypeToFunnelSlug(params.interestType),
        lead_status: inquiryStatusToLeadStatus(params.status),
        source_url: params.source,
        referrer: params.contact.referrer,
        utm_source: params.contact.utmSource,
        utm_medium: params.contact.utmMedium,
        utm_campaign: params.contact.utmCampaign,
        utm_content: params.contact.utmContent,
        utm_term: params.contact.utmTerm,
        legacy_source: 'latimore-hub-main:Inquiry',
        legacy_id: params.inquiryId
      },
      { onConflict: 'legacy_source,legacy_id' }
    )
    if (error) {
      console.error('[unified-sync] failed to upsert lead', error)
    }
  } catch (err) {
    console.error('[unified-sync] failed to sync inquiry to unified schema', err)
  }
}
