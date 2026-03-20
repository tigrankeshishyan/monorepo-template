// ─── Status / Lifecycle ───────────────────────────────────────────────────────

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  ARCHIVED = "ARCHIVED",
}

export enum Environment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// ─── Generic helpers ──────────────────────────────────────────────────────────

/**
 * Use this instead of `any` for dynamic objects with unknown values.
 */
export type GenericObject = Record<string, unknown>;

/**
 * Type for a function that returns a promise or a value.
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Nullable wrapper.
 */
export type Nullable<T> = T | null;

/**
 * Makes specific keys of T optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
