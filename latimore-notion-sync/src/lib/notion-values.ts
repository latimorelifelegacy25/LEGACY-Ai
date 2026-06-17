import * as Builder from "@notionhq/workers/builder";
import type { RelationValue, TextValue } from "@notionhq/workers/types";

/** Rich text value, or empty if the source value is missing. */
export function textOrEmpty(value: string | null | undefined): TextValue {
	return value ? Builder.richText(value) : [];
}

/** Select value, or empty if the source value is missing. */
export function selectOrEmpty(value: string | null | undefined): TextValue {
	return value ? Builder.select(value) : [];
}

/** Multi-select value, or empty if the source array is missing/empty. */
export function multiSelectOrEmpty(values: string[] | null | undefined): TextValue {
	return values && values.length > 0 ? Builder.multiSelect(...values) : [];
}

/** Number value, or empty if the source value is missing. */
export function numberOrEmpty(value: number | null | undefined): TextValue {
	return typeof value === "number" ? Builder.number(value) : [];
}

/** Datetime value, or empty if the source value is missing. */
export function dateTimeOrEmpty(value: string | null | undefined): TextValue {
	return value ? Builder.dateTime(value) : [];
}

/** URL value, or empty if the source value is missing. */
export function urlOrEmpty(value: string | null | undefined): TextValue {
	return value ? Builder.url(value) : [];
}

/** Relation value pointing at a single related record, or empty if the key is missing. */
export function relationOrEmpty(primaryKey: string | null | undefined): RelationValue {
	return primaryKey ? [Builder.relation(primaryKey)] : [];
}
