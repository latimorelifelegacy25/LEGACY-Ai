import { createSupabaseAdmin } from "@/lib/supabase-admin";

const PRIORITY_TO_FUNNEL: Record<string, string | null> = {
  "Protect My Family": "life-insurance-basics",
  "Cover My Mortgage": "mortgage-protection",
  "Plan Final Expenses": "life-insurance-basics",
  "Build Retirement Income": "retirement-annuities",
  "Protect My Business": "business-key-person",
  "Plan for My Children": "college-funding",
  // No funnel in the unified schema corresponds to estate planning.
  "Add Estate Planning": null
};

const STATUS_TO_LEAD_STATUS: Record<string, string> = {
  "New Lead": "new",
  Qualified: "nurturing",
  Booked: "booked",
  "Closed Won": "consulted"
};

// Best-effort mirrors of education_leads/lead_activities into the unified
// leads/events schema. Never throw - a failure here must not block the
// primary Supabase write the caller already committed.

export async function upsertUnifiedLead(params: {
  legacyLeadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  priorityPath: string | null;
  legacyScore: number | null;
  leadStatus: string;
}) {
  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("leads").upsert(
      {
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        phone: params.phone,
        selected_funnel_slug: params.priorityPath
          ? PRIORITY_TO_FUNNEL[params.priorityPath] ?? null
          : null,
        lead_score: params.legacyScore ?? 0,
        lead_status: STATUS_TO_LEAD_STATUS[params.leadStatus] ?? "new",
        source_url: "/education",
        legacy_source: "latimore-legacy-checkup:education_leads",
        legacy_id: params.legacyLeadId
      },
      { onConflict: "legacy_source,legacy_id" }
    );
    if (error) {
      console.error("[unified-sync] failed to upsert lead", error);
    }
  } catch (err) {
    console.error("[unified-sync] failed to upsert unified lead", err);
  }
}

export async function logUnifiedEvent(params: {
  legacyLeadId: string | null;
  email: string | null;
  eventName: string;
  pageUrl: string;
  legacyActivityId: string;
}) {
  try {
    const supabase = createSupabaseAdmin();

    let leadId: string | null = null;
    if (params.legacyLeadId) {
      const { data } = await supabase
        .from("leads")
        .select("id")
        .eq("legacy_source", "latimore-legacy-checkup:education_leads")
        .eq("legacy_id", params.legacyLeadId)
        .maybeSingle();
      leadId = data?.id ?? null;
    }

    const { error } = await supabase.from("events").upsert(
      {
        lead_id: leadId,
        event_name: params.eventName,
        funnel_slug: null,
        page_url: params.pageUrl,
        metadata: params.email ? { email: params.email } : {},
        legacy_source: "latimore-legacy-checkup:lead_activities",
        legacy_id: params.legacyActivityId
      },
      { onConflict: "legacy_source,legacy_id" }
    );
    if (error) {
      console.error("[unified-sync] failed to upsert event", error);
    }
  } catch (err) {
    console.error("[unified-sync] failed to log unified event", err);
  }
}
