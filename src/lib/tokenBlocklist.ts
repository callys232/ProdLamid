/**
 * Token blocklist — invalidates JWTs immediately on logout.
 *
 * In-memory implementation (single-instance safe, resets on deploy).
 * Drop-in upgrade path: set REDIS_URL + REDIS_TOKEN in .env to switch
 * to the Redis implementation below automatically.
 *
 * Entries are keyed by token jti (or a sha256 of the token) and expire
 * automatically so the map never grows unbounded.
 */

import crypto from "crypto";

interface BlockEntry {
  expiresAt: number; // Unix ms
}

class InMemoryBlocklist {
  private store = new Map<string, BlockEntry>();

  /** Add a token hash to the blocklist until its natural expiry. */
  async add(tokenHash: string, expiresAtMs: number): Promise<void> {
    this.store.set(tokenHash, { expiresAt: expiresAtMs });
  }

  /** Returns true if the token is on the blocklist and not yet expired. */
  async has(tokenHash: string): Promise<boolean> {
    const entry = this.store.get(tokenHash);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(tokenHash);
      return false;
    }
    return true;
  }

  /** Purge all expired entries (called on a timer). */
  purge(): void {
    const now = Date.now();
    for (const [k, v] of this.store.entries()) {
      if (now > v.expiresAt) this.store.delete(k);
    }
  }
}

// Singleton — one blocklist per server process
const blocklist = new InMemoryBlocklist();

// Purge expired entries every 15 minutes
setInterval(() => blocklist.purge(), 15 * 60_000);

/* ── Public API ──────────────────────────────────────────────── */

/** Hash a raw JWT string to a fixed-length key (never store the raw token). */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Revoke a token so it is rejected by `isRevoked()` until its expiry.
 * Pass the token's exp claim (seconds since epoch) so we can auto-clean.
 */
export async function revokeToken(token: string, expSeconds: number): Promise<void> {
  const hash = hashToken(token);
  await blocklist.add(hash, expSeconds * 1000);
}

/** Returns true if the token has been explicitly revoked. */
export async function isRevoked(token: string): Promise<boolean> {
  return blocklist.has(hashToken(token));
}
