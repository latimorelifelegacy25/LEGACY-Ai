import { Worker } from "@notionhq/workers";
import * as Builder from "@notionhq/workers/builder";
import * as Schema from "@notionhq/workers/schema";
import type { SelectOption } from "@notionhq/workers/types";
import {
	dateTimeOrEmpty,
	numberOrEmpty,
	relationOrEmpty,
	selectOrEmpty,
	textOrEmpty,
	urlOrEmpty,
} from "./lib/notion-values.js";
import { getSupabase } from "./lib/supabase.js";

const worker = new Worker();
export default worker;

/**
 * Supabase's free tier allows generous request rates, but we keep this
 * conservative since all three syncs share the budget.
 */
const supabasePacer = worker.pacer("supabase", {
	allowedRequests: 5,
	intervalMs: 1000,
});

const PAGE_SIZE = 50;

// ---------------------------------------------------------------------------
// Shared option lists
// (mirrors supabase-unified/sql/001_unified_schema.sql, the unified schema
// from SPEC-1-Latimore-Life-Legacy-Education-Funnel-System)
// ---------------------------------------------------------------------------

const funnelOptions: SelectOption[] = [
	{ name: "Life Insurance Basics", color: "blue" },
	{ name: "Mortgage Protection", color: "orange" },
	{ name: "Living Benefits", color: "green" },
	{ name: "Retirement / Annuities", color: "purple" },
	{ name: "401(k) Rollover", color: "yellow" },
	{ name: "College Funding", color: "pink" },
	{ name: "Business / Key Person", color: "brown" },
];

/** Maps a `funnels.slug` value to its display name for the select fields above. */
const FUNNEL_NAMES: Record<string, string> = {
	"life-insurance-basics": "Life Insurance Basics",
	"mortgage-protection": "Mortgage Protection",
	"living-benefits": "Living Benefits",
	"retirement-annuities": "Retirement / Annuities",
	"401k-rollover": "401(k) Rollover",
	"college-funding": "College Funding",
	"business-key-person": "Business / Key Person",
};

function funnelName(slug: string | null | undefined): string | null {
	return slug ? FUNNEL_NAMES[slug] ?? slug : null;
}

const leadStatusOptions: SelectOption[] = [
	{ name: "new", color: "blue" },
	{ name: "nurturing", color: "yellow" },
	{ name: "booked", color: "purple" },
	{ name: "consulted", color: "green" },
	{ name: "disqualified", color: "red" },
	{ name: "archived", color: "gray" },
];

const preferredContactMethodOptions: SelectOption[] = [
	{ name: "email", color: "blue" },
	{ name: "phone", color: "green" },
	{ name: "text", color: "yellow" },
	{ name: "any", color: "gray" },
];

const bookingStatusOptions: SelectOption[] = [
	{ name: "scheduled", color: "blue" },
	{ name: "completed", color: "green" },
	{ name: "canceled", color: "red" },
	{ name: "rescheduled", color: "yellow" },
];

// Known event_name values from production plus the SPEC's analytics event
// vocabulary. event_name is unconstrained text, so Notion will add any new
// values it sees as additional select options automatically.
const eventNameOptions: SelectOption[] = [
	{ name: "page_view", color: "default" },
	{ name: "cta_click", color: "blue" },
	{ name: "call_click", color: "green" },
	{ name: "text_click", color: "green" },
	{ name: "email_click", color: "green" },
	{ name: "book_click", color: "purple" },
	{ name: "form_submit", color: "orange" },
	{ name: "lead_created", color: "orange" },
	{ name: "lead_submit", color: "orange" },
	{ name: "appointment_booked", color: "purple" },
	{ name: "calendly_booked", color: "purple" },
	{ name: "calendly_open", color: "purple" },
	{ name: "stage_changed", color: "yellow" },
	{ name: "county_selected", color: "gray" },
	{ name: "product_selected", color: "gray" },
	{ name: "lead_magnet_download", color: "pink" },
	{ name: "quiz_start", color: "brown" },
	{ name: "quiz_complete", color: "brown" },
	{ name: "funnel_view", color: "default" },
	{ name: "email_signup", color: "blue" },
	{ name: "outbound_quote_click", color: "red" },
];

// ---------------------------------------------------------------------------
// Leads database + sync
// (mirrors public.leads in supabase-unified/sql/001_unified_schema.sql)
// ---------------------------------------------------------------------------

export const leads = worker.database("leads", {
	type: "managed",
	initialTitle: "Leads",
	primaryKeyProperty: "Lead ID",
	schema: {
		databaseIcon: Builder.emojiIcon("🧭"),
		properties: {
			Name: Schema.title(),
			"Lead ID": Schema.richText(),
			Email: Schema.email(),
			Phone: Schema.phoneNumber(),
			"Zip Code": Schema.richText(),
			"Preferred Contact Method": Schema.select(preferredContactMethodOptions),
			Funnel: Schema.select(funnelOptions),
			"Lead Score": Schema.number(),
			"Lead Status": Schema.select(leadStatusOptions),
			"Source URL": Schema.url(),
			Referrer: Schema.richText(),
			"UTM Source": Schema.richText(),
			"UTM Medium": Schema.richText(),
			"UTM Campaign": Schema.richText(),
			"Legacy Source": Schema.richText(),
			"Created At": Schema.date(),
			"Updated At": Schema.date(),
		},
	},
});

type LeadCursor = { updatedAt: string; id: string };

type LeadRow = {
	id: string;
	first_name: string;
	last_name: string | null;
	email: string;
	phone: string | null;
	zip_code: string | null;
	preferred_contact_method: string | null;
	selected_funnel_slug: string | null;
	lead_score: number;
	lead_status: string;
	source_url: string | null;
	referrer: string | null;
	utm_source: string | null;
	utm_medium: string | null;
	utm_campaign: string | null;
	legacy_source: string | null;
	created_at: string;
	updated_at: string;
};

export const leadsSync = worker.sync("leadsSync", {
	database: leads,
	mode: "incremental",
	schedule: "15m",
	execute: async (state: LeadCursor | undefined) => {
		await supabasePacer.wait();

		const supabase = getSupabase();
		let query = supabase
			.from("leads")
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

		const rows = (data ?? []) as LeadRow[];

		const changes = rows.map((row) => ({
			type: "upsert" as const,
			key: row.id,
			properties: {
				Name: Builder.title(`${row.first_name} ${row.last_name ?? ""}`.trim()),
				"Lead ID": Builder.richText(row.id),
				Email: Builder.email(row.email),
				Phone: row.phone ? Builder.phoneNumber(row.phone) : [],
				"Zip Code": textOrEmpty(row.zip_code),
				"Preferred Contact Method": selectOrEmpty(row.preferred_contact_method),
				Funnel: selectOrEmpty(funnelName(row.selected_funnel_slug)),
				"Lead Score": numberOrEmpty(row.lead_score),
				"Lead Status": selectOrEmpty(row.lead_status),
				"Source URL": urlOrEmpty(row.source_url),
				Referrer: textOrEmpty(row.referrer),
				"UTM Source": textOrEmpty(row.utm_source),
				"UTM Medium": textOrEmpty(row.utm_medium),
				"UTM Campaign": textOrEmpty(row.utm_campaign),
				"Legacy Source": textOrEmpty(row.legacy_source),
				"Created At": dateTimeOrEmpty(row.created_at),
				"Updated At": dateTimeOrEmpty(row.updated_at),
			},
			upstreamUpdatedAt: row.updated_at,
		}));

		const last = rows[rows.length - 1];
		const nextState: LeadCursor | undefined = last
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
// Events database + sync
// (mirrors public.events in supabase-unified/sql/001_unified_schema.sql)
// ---------------------------------------------------------------------------

export const events = worker.database("events", {
	type: "managed",
	initialTitle: "Events",
	primaryKeyProperty: "Event ID",
	schema: {
		databaseIcon: Builder.emojiIcon("📈"),
		properties: {
			Event: Schema.title(),
			"Event ID": Schema.richText(),
			"Event Name": Schema.select(eventNameOptions),
			Funnel: Schema.select(funnelOptions),
			"Page URL": Schema.url(),
			Lead: Schema.relation("leads", {
				twoWay: true,
				relatedPropertyName: "Events",
			}),
			"Logged At": Schema.date(),
		},
	},
});

type EventCursor = { createdAt: string; id: string };

type EventRow = {
	id: string;
	lead_id: string | null;
	event_name: string;
	funnel_slug: string | null;
	page_url: string | null;
	created_at: string;
};

export const eventsSync = worker.sync("eventsSync", {
	database: events,
	mode: "incremental",
	schedule: "15m",
	execute: async (state: EventCursor | undefined) => {
		await supabasePacer.wait();

		const supabase = getSupabase();
		let query = supabase
			.from("events")
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

		const rows = (data ?? []) as EventRow[];

		const changes = rows.map((row) => ({
			type: "upsert" as const,
			key: row.id,
			properties: {
				Event: Builder.title(row.event_name),
				"Event ID": Builder.richText(row.id),
				"Event Name": selectOrEmpty(row.event_name),
				Funnel: selectOrEmpty(funnelName(row.funnel_slug)),
				"Page URL": urlOrEmpty(row.page_url),
				Lead: relationOrEmpty(row.lead_id),
				"Logged At": dateTimeOrEmpty(row.created_at),
			},
			upstreamUpdatedAt: row.created_at,
		}));

		const last = rows[rows.length - 1];
		const nextState: EventCursor | undefined = last
			? { createdAt: last.created_at, id: last.id }
			: state;

		return {
			changes,
			hasMore: rows.length === PAGE_SIZE,
			nextState,
		};
	},
});

// ---------------------------------------------------------------------------
// Bookings database + sync
// (mirrors public.bookings in supabase-unified/sql/001_unified_schema.sql)
// ---------------------------------------------------------------------------

export const bookings = worker.database("bookings", {
	type: "managed",
	initialTitle: "Bookings",
	primaryKeyProperty: "Booking ID",
	schema: {
		databaseIcon: Builder.emojiIcon("📅"),
		properties: {
			Name: Schema.title(),
			"Booking ID": Schema.richText(),
			"Invitee Email": Schema.email(),
			"Invitee Name": Schema.richText(),
			Status: Schema.select(bookingStatusOptions),
			"Scheduled Start": Schema.date(),
			Lead: Schema.relation("leads", {
				twoWay: true,
				relatedPropertyName: "Bookings",
			}),
		},
	},
});

type BookingCursor = { createdAt: string; id: string };

type BookingRow = {
	id: string;
	lead_id: string | null;
	invitee_email: string | null;
	invitee_name: string | null;
	status: string;
	scheduled_start_time: string | null;
	created_at: string;
};

export const bookingsSync = worker.sync("bookingsSync", {
	database: bookings,
	mode: "incremental",
	schedule: "15m",
	execute: async (state: BookingCursor | undefined) => {
		await supabasePacer.wait();

		const supabase = getSupabase();
		let query = supabase
			.from("bookings")
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

		const rows = (data ?? []) as BookingRow[];

		const changes = rows.map((row) => ({
			type: "upsert" as const,
			key: row.id,
			properties: {
				Name: Builder.title(row.invitee_name ?? row.invitee_email ?? "Booking"),
				"Booking ID": Builder.richText(row.id),
				"Invitee Email": row.invitee_email ? Builder.email(row.invitee_email) : [],
				"Invitee Name": textOrEmpty(row.invitee_name),
				Status: selectOrEmpty(row.status),
				"Scheduled Start": dateTimeOrEmpty(row.scheduled_start_time),
				Lead: relationOrEmpty(row.lead_id),
			},
			upstreamUpdatedAt: row.created_at,
		}));

		const last = rows[rows.length - 1];
		const nextState: BookingCursor | undefined = last
			? { createdAt: last.created_at, id: last.id }
			: state;

		return {
			changes,
			hasMore: rows.length === PAGE_SIZE,
			nextState,
		};
	},
});
