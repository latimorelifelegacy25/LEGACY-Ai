import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { logUnifiedEvent } from "@/lib/unified-sync";

type ActivityBody = {
  lead_id?: string | null;
  email?: string | null;
  activity_type?: string;
  activity_detail?: string;
  page_path?: string;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ActivityBody;

    const activityType = cleanText(body.activity_type);
    const activityDetail = cleanText(body.activity_detail);
    const email = cleanText(body.email).toLowerCase();
    const leadId = cleanText(body.lead_id);
    const pagePath = cleanText(body.page_path) || "/education";

    if (!activityType) {
      return NextResponse.json(
        { error: "Missing activity_type." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: activityRow, error } = await supabase
      .from("lead_activities")
      .insert({
        lead_id: leadId || null,
        email: email || null,
        activity_type: activityType,
        activity_detail: activityDetail || null,
        page_path: pagePath
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      { error: error instanceof Error ? error.message : "Unknown server error." },
      { status: 500 }
    );
  }
}
