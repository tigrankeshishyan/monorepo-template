import { getSupabaseClient } from "./client";
import type { UserRow, ProfileRow } from "./types";

// ─── DatabaseManager ──────────────────────────────────────────────────────────

export class DatabaseManager {
  private static instance: DatabaseManager | null = null;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await getSupabaseClient().from("users").select("id").limit(1);
      return error === null;
    } catch {
      return false;
    }
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  async getUserById(id: string): Promise<UserRow | null> {
    const { data, error } = await getSupabaseClient()
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as UserRow;
  }

  async getUserByEmail(email: string): Promise<UserRow | null> {
    const { data, error } = await getSupabaseClient()
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return null;
    return data as UserRow;
  }

  // ─── Profiles ─────────────────────────────────────────────────────────────

  async getProfileById(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await getSupabaseClient()
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data as ProfileRow;
  }
}

export function getDatabaseManager(): DatabaseManager {
  return DatabaseManager.getInstance();
}
