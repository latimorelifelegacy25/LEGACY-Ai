export type GuideLeadPayload = {
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
};

export const bookingUrl = "https://calendar.app.google/2ERTvJcQQTNF4DFJ9";

export const guideTitles: Record<string, string> = {
  "Protect My Family": "Family Protection Starter Guide",
  "Cover My Mortgage": "Mortgage Protection Guide",
  "Plan Final Expenses": "Final Expense Planning Guide",
  "Build Retirement Income": "Retirement Income Guide",
  "Protect My Business": "Business Owner Protection Guide",
  "Plan for My Children": "Children's Future Planning Guide",
  "Add Estate Planning": "Estate Planning Checklist"
};

export const priorityChecklists: Record<string, string[]> = {
  "Protect My Family": [
    "Review who depends on your income, care, or financial support.",
    "Estimate protection needs using Debt, Income, Mortgage, and Education.",
    "Compare personal coverage against employer-only coverage.",
    "Review whether living benefits may fit your protection strategy."
  ],
  "Cover My Mortgage": [
    "Confirm your current mortgage balance and payoff timeline.",
    "Review whether your family could remain in the home after an unexpected event.",
    "Compare term, permanent, and blended protection options.",
    "Check whether disability, illness, or chronic condition features should be reviewed."
  ],
  "Plan Final Expenses": [
    "Estimate final expense, burial, memorial, and short-term family support needs.",
    "Review whether coverage is permanent or temporary.",
    "Confirm beneficiaries and policy ownership.",
    "Discuss affordability and underwriting options."
  ],
  "Build Retirement Income": [
    "Separate accumulation planning from income distribution planning.",
    "Review tax-deferred, taxable, and tax-advantaged buckets.",
    "Discuss market risk, income timing, and longevity risk.",
    "Explore whether annuity or insurance-based strategies deserve review."
  ],
  "Protect My Business": [
    "Identify key people, partners, debts, and continuity obligations.",
    "Review buy-sell, key person, and business debt protection needs.",
    "Confirm beneficiary, owner, and payer structure.",
    "Coordinate business protection with personal family protection."
  ],
  "Plan for My Children": [
    "Clarify education, savings, protection, and legacy goals.",
    "Review who would fund the plan if income stopped.",
    "Compare child-focused savings and protection strategies.",
    "Coordinate guardianship and estate planning conversations."
  ],
  "Add Estate Planning": [
    "Review whether wills, trusts, powers of attorney, and health care directives exist.",
    "Confirm beneficiary designations across policies and accounts.",
    "Coordinate policy protection with written instructions.",
    "Discuss when legal estate planning support may be appropriate."
  ]
};

export function getGuideTitle(priority?: string) {
  if (!priority) return guideTitles["Protect My Family"];
  return guideTitles[priority] || guideTitles["Protect My Family"];
}

export function getPriorityChecklist(priority?: string) {
  if (!priority) return priorityChecklists["Protect My Family"];
  return priorityChecklists[priority] || priorityChecklists["Protect My Family"];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getScoreStatus(score?: number) {
  if (typeof score !== "number") return "Needs Review";
  if (score >= 80) return "Strong Foundation";
  if (score >= 60) return "Moderate Gap";
  return "Needs Review";
}

export function getReadinessRows(score?: number) {
  const safeScore = typeof score === "number" ? score : 0;

  return [
    ["Family Protection", safeScore >= 80 ? "Prepared" : safeScore >= 60 ? "Moderate Gap" : "Needs Review"],
    ["Income Protection", safeScore >= 80 ? "Stable" : safeScore >= 60 ? "Moderate Gap" : "Needs Review"],
    ["Retirement Income", safeScore >= 80 ? "On Track" : safeScore >= 60 ? "Needs Strategy" : "Needs Review"],
    ["Estate Planning", safeScore >= 80 ? "Included" : safeScore >= 60 ? "Missing or Unknown" : "Needs Review"],
    ["Booking Readiness", safeScore >= 60 ? "High" : "Recommended"]
  ];
}

export function formatList(values?: string[]) {
  if (!values || values.length === 0) return "Not provided";
  return values.join(", ");
}

export function getFullName(payload: GuideLeadPayload) {
  return [payload.first_name, payload.last_name].filter(Boolean).join(" ").trim() || "there";
}

export function getComplianceText() {
  return "This guide is for educational purposes only. It is not tax, legal, investment, or insurance advice. Products and strategies vary by state, carrier, underwriting, policy design, and client eligibility. Guarantees are based on the claims-paying ability of the issuing insurance company.";
}
