import { Resend } from "resend";
import { GeneratedGuide } from "./pdf-guide";
import {
  GuideLeadPayload,
  bookingUrl,
  getComplianceText,
  getFullName,
  getGuideTitle,
  getReadinessRows
} from "./guide-content";

type EmailResult = {
  ok: boolean;
  status: "sent" | "not_configured" | "failed";
  error?: string;
  id?: string;
};

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "";
}

function getReplyTo() {
  return process.env.RESEND_REPLY_TO || undefined;
}

function getAdvisorEmail() {
  return process.env.RESEND_INTERNAL_NOTIFY_TO || process.env.ADVISOR_EMAIL || "";
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function htmlLayout(title: string, body: string) {
  return `
  <div style="margin:0;background:#f6f7f9;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#2C3E50;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#2C3E50;padding:28px;color:#ffffff;">
        <p style="margin:0 0 8px;color:#C49A6C;letter-spacing:2px;font-size:12px;font-weight:700;">LATIMORE LIFE & LEGACY LLC</p>
        <h1 style="margin:0;font-size:28px;line-height:1.2;">${escapeHtml(title)}</h1>
        <p style="margin:10px 0 0;color:#C49A6C;">Protecting Today. Securing Tomorrow. #TheBeatGoesOn</p>
      </div>
      <div style="padding:28px;">
        ${body}
        <div style="margin-top:28px;padding:18px;background:#f8f3ed;border-left:4px solid #C49A6C;border-radius:12px;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#4b5563;">${getComplianceText()}</p>
        </div>
      </div>
    </div>
  </div>`;
}

function readinessHtml(score?: number) {
  const rows = getReadinessRows(score);

  return `
    <table style="width:100%;border-collapse:collapse;margin:18px 0;">
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;">${escapeHtml(label)}</td>
            <td style="padding:12px;border:1px solid #e5e7eb;color:#C49A6C;font-weight:700;">${escapeHtml(value)}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}) {
  const resend = getResendClient();
  const from = getFromEmail();

  if (!resend || !from) {
    return { ok: false, status: "not_configured" } satisfies EmailResult;
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: getReplyTo(),
      attachments: options.attachments
    });

    if (error) {
      return {
        ok: false,
        status: "failed",
        error: typeof error === "string" ? error : JSON.stringify(error)
      } satisfies EmailResult;
    }

    return {
      ok: true,
      status: "sent",
      id: data?.id
    } satisfies EmailResult;
  } catch (error) {
    return {
      ok: false,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown Resend error."
    } satisfies EmailResult;
  }
}

export async function sendGuideEmail(payload: GuideLeadPayload, guide: GeneratedGuide) {
  if (!payload.email) {
    return { ok: false, status: "failed", error: "Missing recipient email." } satisfies EmailResult;
  }

  const firstName = payload.first_name || "there";
  const title = getGuideTitle(payload.priority_path);
  const scoreText = typeof payload.legacy_score === "number" ? `${Math.round(payload.legacy_score)} / 100` : "Needs Review";

  return sendEmail({
    to: payload.email,
    subject: `${title} | Latimore Life & Legacy`,
    html: htmlLayout(
      "Your Legacy Protection Guide",
      `
      <p style="font-size:16px;line-height:1.7;margin-top:0;">Hi ${escapeHtml(firstName)},</p>
      <p style="font-size:16px;line-height:1.7;">Thank you for completing the Latimore Legacy Checkup. Your branded education guide is attached as a PDF.</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Selected priority:</strong> ${escapeHtml(payload.priority_path || "Protect My Family")}</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Legacy Readiness Score:</strong> ${escapeHtml(scoreText)}</p>
      ${readinessHtml(payload.legacy_score)}
      <p style="font-size:16px;line-height:1.7;">A helpful next step is a 30-minute Legacy Protection Review with Jackson Latimore Sr.</p>
      <p style="margin:26px 0;">
        <a href="${bookingUrl}" style="background:#C49A6C;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:700;display:inline-block;">Book 30 Minutes With Jackson</a>
      </p>`
    ),
    text: `Hi ${escapeHtml(firstName)},

Thank you for completing the Latimore Legacy Checkup. Your education guide is attached.

Selected priority: ${escapeHtml(payload.priority_path || "Protect My Family")}
Legacy Readiness Score: ${escapeHtml(scoreText)}

Book 30 Minutes With Jackson:
${bookingUrl}

${getComplianceText()}`,
    attachments: [
      {
        filename: guide.filename,
        content: Buffer.from(guide.bytes)
      }
    ]
  });
}

export async function sendCompletedFunnelEmail(payload: GuideLeadPayload) {
  if (!payload.email) {
    return { ok: false, status: "failed", error: "Missing recipient email." } satisfies EmailResult;
  }

  const firstName = payload.first_name || "there";
  const scoreText = typeof payload.legacy_score === "number" ? `${Math.round(payload.legacy_score)} / 100` : "Needs Review";

  return sendEmail({
    to: payload.email,
    subject: "Your Latimore Legacy Checkup Results",
    html: htmlLayout(
      "Your Legacy Checkup Results",
      `
      <p style="font-size:16px;line-height:1.7;margin-top:0;">Hi ${escapeHtml(firstName)},</p>
      <p style="font-size:16px;line-height:1.7;">You completed the Latimore Legacy Checkup. Here is a quick snapshot of your results.</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Selected priority:</strong> ${escapeHtml(payload.priority_path || "Protect My Family")}</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Legacy Readiness Score:</strong> ${escapeHtml(scoreText)}</p>
      ${readinessHtml(payload.legacy_score)}
      <p style="font-size:16px;line-height:1.7;">Your answers suggest it may be worth reviewing family protection, retirement income, tax strategy, and estate planning together.</p>
      <p style="margin:26px 0;">
        <a href="${bookingUrl}" style="background:#C49A6C;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:700;display:inline-block;">Book 30 Minutes With Jackson</a>
      </p>`
    ),
    text: `Hi ${escapeHtml(firstName)},

You completed the Latimore Legacy Checkup.

Selected priority: ${escapeHtml(payload.priority_path || "Protect My Family")}
Legacy Readiness Score: ${escapeHtml(scoreText)}

Book 30 Minutes With Jackson:
${bookingUrl}

${getComplianceText()}`
  });
}

export async function sendAdvisorNotification(payload: GuideLeadPayload, activity: string) {
  const advisorEmail = getAdvisorEmail();

  if (!advisorEmail) {
    return { ok: false, status: "not_configured" } satisfies EmailResult;
  }

  const leadName = getFullName(payload);
  const scoreText = typeof payload.legacy_score === "number" ? `${Math.round(payload.legacy_score)} / 100` : "Needs Review";

  return sendEmail({
    to: advisorEmail,
    subject: `Latimore Lead: ${escapeHtml(activity)} - ${escapeHtml(leadName)}`,
    html: htmlLayout(
      "New Education Funnel Activity",
      `
      <p style="font-size:16px;line-height:1.7;margin-top:0;"><strong>Activity:</strong> ${escapeHtml(activity)}</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Name:</strong> ${escapeHtml(leadName)}</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Email:</strong> ${escapeHtml(payload.email || "Not provided")}</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Phone:</strong> ${escapeHtml(payload.phone || "Not provided")}</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Location:</strong> ${escapeHtml(payload.county || "County not provided")}, ${escapeHtml(payload.state || "State not provided")}</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Priority:</strong> ${escapeHtml(payload.priority_path || "Not provided")}</p>
      <p style="font-size:16px;line-height:1.7;"><strong>Score:</strong> ${escapeHtml(scoreText)}</p>
      ${readinessHtml(payload.legacy_score)}
      <p style="font-size:16px;line-height:1.7;">Follow up from the Supabase CRM activity timeline.</p>`
    ),
    text: `New Education Funnel Activity

Activity: ${escapeHtml(activity)}
Name: ${escapeHtml(leadName)}
Email: ${escapeHtml(payload.email || "Not provided")}
Phone: ${escapeHtml(payload.phone || "Not provided")}
Location: ${escapeHtml(payload.county || "County not provided")}, ${escapeHtml(payload.state || "State not provided")}
Priority: ${escapeHtml(payload.priority_path || "Not provided")}
Score: ${escapeHtml(scoreText)}`
  });
}
