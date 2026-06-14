import { NextRequest, NextResponse } from "next/server";
import { sendAdvisorNotification, sendGuideEmail } from "@/lib/email";
import { generateEducationGuidePdf } from "@/lib/pdf-guide";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const guide = await generateEducationGuidePdf(body);

    let emailStatus = "not_requested";

    if (body.email) {
      const emailResult = await sendGuideEmail(body, guide);
      emailStatus = emailResult.status;

      if (emailResult.ok) {
        await sendAdvisorNotification(body, "Downloaded Guide").catch(() => null);
      }
    }

    return new NextResponse(Buffer.from(guide.bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${guide.filename}"`,
        "X-Guide-Title": guide.title,
        "X-Email-Status": emailStatus
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate guide." },
      { status: 500 }
    );
  }
}
