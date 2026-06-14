import { NextRequest, NextResponse } from "next/server";
import { sendAdvisorNotification, sendCompletedFunnelEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = typeof body.event_type === "string" ? body.event_type : "Completed Funnel";

    if (eventType === "Completed Funnel" || eventType === "Completed Legacy Checkup") {
      const clientEmail = await sendCompletedFunnelEmail(body);
      const advisorEmail = await sendAdvisorNotification(body, "Completed Legacy Checkup");

      return NextResponse.json({
        ok: clientEmail.ok || advisorEmail.ok,
        client_email_status: clientEmail.status,
        advisor_email_status: advisorEmail.status
      });
    }

    const advisorEmail = await sendAdvisorNotification(body, eventType);

    return NextResponse.json({
      ok: advisorEmail.ok,
      advisor_email_status: advisorEmail.status
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send follow-up email." },
      { status: 500 }
    );
  }
}
