import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

type LeadBody = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  state?: string;
  county?: string;
  priority_path?: string;
  family_dependents?: string[];
  income_stability?: string;
  mortgage_or_debt?: string[];
  retirement_status?: string;
  life_insurance_status?: string;
  dime_coverage?: string;
  living_benefits_interest?: string;
  estate_planning_interest?: string;
  legacy_score?: number;
  lead_status?: string;
};

const allowedStatuses = new Set(["New Lead", "Qualified", "Booked", "Closed Won"]);

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadBody;

    const firstName = cleanText(body.first_name);
    const lastName = cleanText(body.last_name);
    const email = cleanText(body.email).toLowerCase();
    const phone = cleanText(body.phone);
    const state = cleanText(body.state);
    const county = cleanText(body.county);

    if (!firstName || !lastName || !email || !phone || !state || !county) {
      return NextResponse.json(
        { error: "Missing required lead fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const leadStatus = allowedStatuses.has(cleanText(body.lead_status))
      ? cleanText(body.lead_status)
      : "New Lead";

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("education_leads")
      .upsert(
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          state,
          county,
          priority_path: cleanText(body.priority_path) || null,
          family_dependents: cleanStringArray(body.family_dependents),
          income_stability: cleanText(body.income_stability) || null,
          mortgage_or_debt: cleanStringArray(body.mortgage_or_debt),
          retirement_status: cleanText(body.retirement_status) || null,
          life_insurance_status: cleanText(body.life_insurance_status) || null,
          dime_coverage: cleanText(body.dime_coverage) || null,
          living_benefits_interest: cleanText(body.living_benefits_interest) || null,
          estate_planning_interest: cleanText(body.estate_planning_interest) || null,
          legacy_score:
            typeof body.legacy_score === "number"
              ? Math.max(0, Math.min(100, Math.round(body.legacy_score)))
              : null,
          lead_source: "Education Funnel",
          lead_status: leadStatus,
          updated_at: now,
          last_activity: now
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lead_id: data.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error." },
      { status: 500 }
    );
  }
}
