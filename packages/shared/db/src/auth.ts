import jwt from "jsonwebtoken";
import { getSupabaseClient } from "./client";
import type { AuthSession, JwtPayload } from "./types";

// ─── JWT helpers ──────────────────────────────────────────────────────────────

function getJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret || secret.length < 32) {
    throw new Error(
      "[shared-db/auth] JWT_SECRET must be set and at least 32 characters long",
    );
  }
  return secret;
}

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">, expiresIn = "7d"): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch (err) {
    throw new Error(`Invalid or expired token: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── Supabase session validation ──────────────────────────────────────────────

/**
 * Validates a Supabase access token against the Auth API.
 * Returns the session or throws on failure.
 */
export async function validateSupabaseSession(accessToken: string): Promise<AuthSession> {
  const { data, error } = await getSupabaseClient().auth.getUser(accessToken);

  if (error || !data.user) {
    throw new Error("Invalid or expired Supabase session");
  }

  return {
    userId: data.user.id,
    email: data.user.email ?? "",
    role: (data.user.user_metadata?.["role"] as string | undefined) ?? "user",
  };
}

// ─── Bearer token extraction ──────────────────────────────────────────────────

/**
 * Extracts the Bearer token from an Authorization header value.
 * Returns null if not present or malformed.
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  return token.length > 0 ? token : null;
}
