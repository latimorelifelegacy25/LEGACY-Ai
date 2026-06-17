import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

/**
 * Lazily creates a Supabase client using the service role key.
 * Credentials must be set with `ntn workers env set` — see .env.example.
 */
export function getSupabase(): SupabaseClient {
	if (client) return client;

	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url || !key) {
		throw new Error(
			"Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them with `ntn workers env set`.",
		);
	}

	client = createClient(url, key, {
		auth: { autoRefreshToken: false, persistSession: false },
	});

	return client;
}
