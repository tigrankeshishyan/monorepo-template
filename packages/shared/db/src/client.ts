import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─── Env validation ───────────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[shared-db] Missing required environment variable: ${name}\n` +
        `Make sure your .env file is loaded and contains ${name}`,
    );
  }
  return value;
}

// ─── Singleton client ─────────────────────────────────────────────────────────

let _client: SupabaseClient | null = null;

/**
 * Returns the shared Supabase admin client (service-role key).
 * Validates env vars on first call and throws immediately with a clear message
 * if they are missing — fail fast before any DB operation is attempted.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  _client = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _client;
}

/**
 * Creates a per-request Supabase client using the caller's JWT access token.
 * Use this for endpoints where you want Supabase RLS to apply.
 */
export function getSupabaseClientForUser(accessToken: string): SupabaseClient {
  const url = requireEnv("SUPABASE_URL");
  const anonKey = requireEnv("SUPABASE_ANON_KEY");

  return createClient(url, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
