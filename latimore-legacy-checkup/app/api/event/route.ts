import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { logUnifiedEvent } from "@/lib/unified-sync";

type EventPayload = {
  lead_id?: unknown;
  leadId?: unknown;
  email?: unknown;
  type?: unknown;
  name?: unknown;
  event?: unknown;
  activity_type?: unknown;
  activityType?: unknown;
  activity_detail?: unknown;
  activityDetail?: unknown;
  detail?: unknown;
  page_path?: unknown;
  pagePath?: unknown;
  path?: unknown;
  url?: unknown;
  session_id?: unknown;
  sessionId?: unknown;
  properties?: unknown;
  data?: unknown;
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asJsonText(value: unknown) {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "string") return value.trim();

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function pickActivityType(body: EventPayload) {
  return (
    asText(body.activity_type) ||
    asText(body.activityType) ||
    asText(body.event) ||
    asText(body.type) ||
    asText(body.name) ||
    "Event"
  );
}

function pickActivityDetail(body: EventPayload) {
  return (
    asText(body.activity_detail) ||
    asText(body.activityDetail) ||
    asText(body.detail) ||
    asJsonText(body.properties) ||
    asJsonText(body.data) ||
    asText(body.session_id) ||
    asText(body.sessionId) ||
    null
  );
}

function pickPagePath(body: EventPayload) {
  return (
    asText(body.page_path) ||
    asText(body.pagePath) ||
    asText(body.path) ||
    asText(body.url) ||
    "/education"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EventPayload;

    const leadId = asText(body.lead_id) || asText(body.leadId);
    const email = asText(body.email).toLowerCase();
    const activityType = pickActivityType(body);
    const activityDetail = pickActivityDetail(body);
    const pagePath = pickPagePath(body);

    const supabase = createSupabaseAdmin();

    const { data: activityRow, error } = await supabase
      .from("lead_activities")
      .insert({
        lead_id: leadId || null,
        email: email || null,
        activity_type: activityType,
        activity_detail: activityDetail,
        page_path: pagePath
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message, activity_type: activityType },
        { status: 500 }
      );
    }

    if (leadId) {
      await supabase
        .from("education_leads")
        .update({ last_activity: new Date().toISOString() })
        .eq("id", leadId);
    }

    await logUnifiedEvent({
      legacyLeadId: leadId || null,
      email: email || null,
      eventName: activityType,
      pageUrl: pagePath,
      legacyActivityId: activityRow.id
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Event ingest failed." },
      { status: 500 }
    );
  }
}
