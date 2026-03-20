// ─── DB row types ─────────────────────────────────────────────────────────────
// Add your Supabase table types here, matching your schema exactly.
// Tip: you can generate these automatically with `supabase gen types typescript`.

export interface UserRow {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string; // references users.id
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthSession {
  userId: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
