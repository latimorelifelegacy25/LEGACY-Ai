import { NextRequest, NextResponse } from "next/server";

const guideTitles: Record<string, string> = {
  "Protect My Family": "Family Protection Starter Guide",
  "Cover My Mortgage": "Mortgage Protection Guide",
  "Plan Final Expenses": "Final Expense Planning Guide",
  "Build Retirement Income": "Retirement Income Guide",
  "Protect My Business": "Business Owner Protection Guide",
  "Plan for My Children": "Children’s Future Planning Guide",
  "Add Estate Planning": "Estate Planning Checklist"
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const priority = typeof body.priority_path === "string" ? body.priority_path : "Protect My Family";
  const score = typeof body.legacy_score === "number" ? Math.round(body.legacy_score) : null;
  const title = guideTitles[priority] || "Family Protection Starter Guide";

  const content = `
${title}
Latimore Life & Legacy LLC
Protecting Today. Securing Tomorrow.
#TheBeatGoesOn

Educational Use Only
This guide is for educational purposes only. It is not tax, legal, investment, or insurance advice. Products and strategies vary by state, carrier, underwriting, policy design, and client eligibility.

Your selected priority:
${priority}

${score === null ? "" : `Legacy Readiness Score: ${score} / 100`}

Recommended review checklist:
1. Identify who depends on your income or support.
2. Review whether your current plan addresses Debt, Income, Mortgage, and Education needs.
3. Confirm whether coverage is personal, employer-based, temporary, permanent, or unknown.
4. Ask whether living benefits may be appropriate for your situation.
5. Review retirement savings separately from retirement income planning.
6. Consider whether estate planning documents should support the financial plan.
7. Schedule a 30-minute Legacy Protection Review with Jackson Latimore Sr.

Booking link:
https://calendar.app.google/2ERTvJcQQTNF4DFJ9
`.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slugify(title)}.txt"`
    }
  });
}
