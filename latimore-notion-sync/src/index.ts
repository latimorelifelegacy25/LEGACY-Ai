import { Worker } from "@notionhq/workers";
import * as Builder from "@notionhq/workers/builder";
import * as Schema from "@notionhq/workers/schema";
import type { SelectOption } from "@notionhq/workers/types";
import {
	dateTimeOrEmpty,
	multiSelectOrEmpty,
	numberOrEmpty,
	relationOrEmpty,
	selectOrEmpty,
	textOrEmpty,
} from "./lib/notion-values.js";
import { getSupabase } from "./lib/supabase.js";

const worker = new Worker();
export default worker;

/**
 * Supabase's free tier allows generous request rates, but we keep this
 * conservative since both syncs share the budget.
 */
const supabasePacer = worker.pacer("supabase", {
	allowedRequests: 5,
	intervalMs: 1000,
});

const PAGE_SIZE = 50;

// ---------------------------------------------------------------------------
// Shared option lists (mirrors app/education/page.tsx and
// app/api/education-lead/route.ts in latimore-legacy-checkup)
// ---------------------------------------------------------------------------

const priorityPathOptions: SelectOption[] = [
	{ name: "Protect My Family", color: "blue" },
	{ name: "Cover My Mortgage", color: "orange" },
	{ name: "Plan Final Expenses", color: "gray" },
	{ name: "Build Retirement Income", color: "green" },
	{ name: "Protect My Business", color: "purple" },
	{ name: "Plan for My Children", color: "pink" },
	{ name: "Add Estate Planning", color: "brown" },
];

const dependentOptions: SelectOption[] = [
	{ name: "Spouse", color: "blue" },
	{ name: "Children", color: "pink" },
	{ name: "Parent or relative", color: "purple" },
	{ name: "Business partner", color: "orange" },
	{ name: "No one currently", color: "gray" },
	{ name: "Other", color: "default" },
];

const incomeOptions: SelectOption[] = [
	{ name: "Less than 1 month", color: "red" },
	{ name: "1–3 months", color: "orange" },
	{ name: "3–6 months", color: "yellow" },
	{ name: "6–12 months", color: "green" },
	{ name: "More than 12 months", color: "blue" },
];

const debtOptions: SelectOption[] = [
	{ name: "Mortgage", color: "orange" },
	{ name: "Rent", color: "yellow" },
	{ name: "Auto loan", color: "brown" },
	{ name: "Credit cards", color: "red" },
	{ name: "Business debt", color: "purple" },
	{ name: "None", color: "gray" },
];

const retirementOptions: SelectOption[] = [
	{ name: "401(k), 403(b), or pension", color: "blue" },
	{ name: "IRA or Roth IRA", color: "green" },
	{ name: "Annuity", color: "purple" },
	{ name: "Personal savings only", color: "yellow" },
	{ name: "Not currently saving", color: "red" },
	{ name: "Not sure", color: "gray" },
];

const lifeInsuranceOptions: SelectOption[] = [
	{ name: "Yes", color: "green" },
	{ name: "No", color: "red" },
	{ name: "Through work only", color: "yellow" },
	{ name: "Not sure", color: "gray" },
];

const yesNoOptions: SelectOption[] = [
	{ name: "Yes", color: "green" },
	{ name: "No", color: "red" },
	{ name: "Somewhat", color: "yellow" },
	{ name: "Not sure", color: "gray" },
];

const leadStatusOptions: SelectOption[] = [
	{ name: "New Lead", color: "blue" },
	{ name: "Qualified", color: "yellow" },
	{ name: "Booked", color: "purple" },
	{ name: "Closed Won", color: "green" },
];

const leadSourceOptions: SelectOption[] = [
	{ name: "Education Funnel", color: "blue" },
];

const activityTypeOptions: SelectOption[] = [
	{ name: "Completed Contact Capture", color: "blue" },
	{ name: "Selected Service Priority", color: "purple" },
	{ name: "Answered Retirement Question", color: "green" },
	{ name: "Answered Life Insurance Question", color: "yellow" },
	{ name: "Answered DIME Question", color: "orange" },
	{ name: "Requested Education Guide", color: "pink" },
	{ name: "Downloaded Guide", color: "brown" },
	{ name: "Emailed Guide", color: "default" },
	{ name: "Clicked Book With Jackson", color: "red" },
	{ name: "Completed Legacy Checkup", color: "gray" },
	{ name: "Event", color: "default" },
];

// ---------------------------------------------------------------------------
// Education Leads database + sync
// (mirrors public.education_leads in supabase/sql/latimore_legacy_checkup.sql)
// ---------------------------------------------------------------------------

export const educationLeads = worker.database("educationLeads", {
	type: "managed",
	initialTitle: "Education Leads",
	primaryKeyProperty: "Lead ID",
	schema: {
		databaseIcon: Builder.emojiIcon("🧭"),
		properties: {
			Name: Schema.title(),
			"Lead ID": Schema.richText(),
			Email: Schema.email(),
			Phone: Schema.phoneNumber(),
			State: Schema.richText(),
			County: Schema.richText(),
			"Priority Path": Schema.select(priorityPathOptions),
			"Family Dependents": Schema.multiSelect(dependentOptions),
			"Income Stability": Schema.select(incomeOptions),
			"Mortgage or Debt": Schema.multiSelect(debtOptions),
			"Retirement Status": Schema.select(retirementOptions),
			"Life Insurance Status": Schema.select(lifeInsuranceOptions),
			"DIME Coverage": Schema.select(yesNoOptions),
			"Living Benefits Interest": Schema.select(yesNoOptions),
			"Estate Planning Interest": Schema.select(yesNoOptions),
			"Legacy Score": Schema.number(),
			"Lead Source": Schema.select(leadSourceOptions),
			"Lead Status": Schema.select(leadStatusOptions),
			"Created At": Schema.date(),
			"Updated At": Schema.date(),
			"Last Activity": Schema.date(),
		},
	},
});

type EducationLeadCursor = { updatedAt: string; id: string };

type EducationLeadRow = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	state: string;
	county: string;
	priority_path: string | null;
	family_dependents: string[] | null;
	income_stability: string | null;
	mortgage_or_debt: string[] | null;
	retirement_status: string | null;
	life_insurance_status: string | null;
	dime_coverage: string | null;
	living_benefits_interest: string | null;
	estate_planning_interest: string | null;
	legacy_score: number | null;
	lead_source: string;
	lead_status: string;
	created_at: string;
	updated_at: string;
	last_activity: string;
};

export const educationLeadsSync = worker.sync("educationLeadsSync", {
	database: educationLeads,
	mode: "incremental",
	schedule: "15m",
	execute: async (state: EducationLeadCursor | undefined) => {
		await supabasePacer.wait();

		const supabase = getSupabase();
		let query = supabase
			.from("education_leads")
			.select("*")
			.order("updated_at", { ascending: true })
			.order("id", { ascending: true })
			.limit(PAGE_SIZE);

		if (state) {
			query = query.or(
				`updated_at.gt.${state.updatedAt},and(updated_at.eq.${state.updatedAt},id.gt.${state.id})`,
			);
		}

		const { data, error } = await query;
		if (error) throw new Error(error.message);

		const rows = (data ?? []) as EducationLeadRow[];

		const changes = rows.map((row) => ({
			type: "upsert" as const,
			key: row.id,
			properties: {
				Name: Builder.title(`${row.first_name} ${row.last_name}`.trim()),
				"Lead ID": Builder.richText(row.id),
				Email: Builder.email(row.email),
				Phone: Builder.phoneNumber(row.phone),
				State: textOrEmpty(row.state),
				County: textOrEmpty(row.county),
				"Priority Path": selectOrEmpty(row.priority_path),
				"Family Dependents": multiSelectOrEmpty(row.family_dependents),
				"Income Stability": selectOrEmpty(row.income_stability),
				"Mortgage or Debt": multiSelectOrEmpty(row.mortgage_or_debt),
				"Retirement Status": selectOrEmpty(row.retirement_status),
				"Life Insurance Status": selectOrEmpty(row.life_insurance_status),
				"DIME Coverage": selectOrEmpty(row.dime_coverage),
				"Living Benefits Interest": selectOrEmpty(row.living_benefits_interest),
				"Estate Planning Interest": selectOrEmpty(row.estate_planning_interest),
				"Legacy Score": numberOrEmpty(row.legacy_score),
				"Lead Source": selectOrEmpty(row.lead_source),
				"Lead Status": selectOrEmpty(row.lead_status),
				"Created At": dateTimeOrEmpty(row.created_at),
				"Updated At": dateTimeOrEmpty(row.updated_at),
				"Last Activity": dateTimeOrEmpty(row.last_activity),
			},
			upstreamUpdatedAt: row.updated_at,
		}));

		const last = rows[rows.length - 1];
		const nextState: EducationLeadCursor | undefined = last
			? { updatedAt: last.updated_at, id: last.id }
			: state;

		return {
			changes,
			hasMore: rows.length === PAGE_SIZE,
			nextState,
		};
	},
});

// ---------------------------------------------------------------------------
// Lead Activities database + sync
// (mirrors public.lead_activities in supabase/sql/latimore_legacy_checkup.sql)
// ---------------------------------------------------------------------------

export const leadActivities = worker.database("leadActivities", {
	type: "managed",
	initialTitle: "Lead Activities",
	primaryKeyProperty: "Activity ID",
	schema: {
		databaseIcon: Builder.emojiIcon("📈"),
		properties: {
			Activity: Schema.title(),
			"Activity ID": Schema.richText(),
			Type: Schema.select(activityTypeOptions),
			Detail: Schema.richText(),
			"Page Path": Schema.richText(),
			Email: Schema.email(),
			Lead: Schema.relation("educationLeads", {
				twoWay: true,
				relatedPropertyName: "Activities",
			}),
			"Logged At": Schema.date(),
		},
	},
});

type LeadActivityCursor = { createdAt: string; id: string };

type LeadActivityRow = {
	id: string;
	lead_id: string | null;
	email: string | null;
	activity_type: string;
	activity_detail: string | null;
	page_path: string;
	created_at: string;
};

export const leadActivitiesSync = worker.sync("leadActivitiesSync", {
	database: leadActivities,
	mode: "incremental",
	schedule: "15m",
	execute: async (state: LeadActivityCursor | undefined) => {
		await supabasePacer.wait();

		const supabase = getSupabase();
		let query = supabase
			.from("lead_activities")
			.select("*")
			.order("created_at", { ascending: true })
			.order("id", { ascending: true })
			.limit(PAGE_SIZE);

		if (state) {
			query = query.or(
				`created_at.gt.${state.createdAt},and(created_at.eq.${state.createdAt},id.gt.${state.id})`,
			);
		}

		const { data, error } = await query;
		if (error) throw new Error(error.message);

		const rows = (data ?? []) as LeadActivityRow[];

		const changes = rows.map((row) => ({
			type: "upsert" as const,
			key: row.id,
			properties: {
				Activity: Builder.title(row.activity_type),
				"Activity ID": Builder.richText(row.id),
				Type: selectOrEmpty(row.activity_type),
				Detail: textOrEmpty(row.activity_detail),
				"Page Path": textOrEmpty(row.page_path),
				Email: row.email ? Builder.email(row.email) : [],
				Lead: relationOrEmpty(row.lead_id),
				"Logged At": dateTimeOrEmpty(row.created_at),
			},
			upstreamUpdatedAt: row.created_at,
		}));

		const last = rows[rows.length - 1];
		const nextState: LeadActivityCursor | undefined = last
			? { createdAt: last.created_at, id: last.id }
			: state;

		return {
			changes,
			hasMore: rows.length === PAGE_SIZE,
			nextState,
		};
	},
});
