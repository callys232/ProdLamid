/**
 * Rate limiter — Upstash Redis sliding window when configured,
 * in-memory fallback for single-instance / dev.
 *
 * Set REDIS_URL + REDIS_TOKEN in .env to enable distributed limiting.
 * Without those vars the in-memory store is used automatically.
 *
 * UPGRADE NOTE — User-level rate limiting:
 * Currently this module is IP-only by convention: all call sites pass the
 * client IP (from x-forwarded-for / request.ip) as the `key` argument.
 * This means authenticated users who share a NAT/proxy can be incorrectly
 * throttled together, and a single bad actor can exhaust the quota for an
 * entire office network.
 *
 * To add user-level limiting, callers should:
 *   1. Extract the authenticated user ID from the session/JWT.
 *   2. Call rateLimit(`user:${userId}:${action}`, opts) for sensitive
 *      authenticated endpoints (e.g. project creation, payment initiation).
 *   3. Continue using the IP key as a secondary, stricter guard for
 *      unauthenticated endpoints (e.g. login attempts, sign-up).
 *
 * No changes to this file's implementation are required — only the `key`
 * passed by each route handler needs to change.
 */

/* ── In-memory fallback ──────────────────────────────────────── */
interface Entry { count: number; resetAt: number }
const store = new Map<string, Entry>();

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) if (now > v.resetAt) store.delete(k);
}, 10 * 60_000);

function memRateLimit(key: string, windowMs: number, max: number) {
  const now   = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }
  entry.count += 1;
  if (entry.count > max) return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

/* ── Upstash sliding window ──────────────────────────────────── */
type LimiterMap = Map<string, import("@upstash/ratelimit").Ratelimit>;
let limiters: LimiterMap | null = null;

async function getUpstashLimiter(windowMs: number, max: number) {
  if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) return null;

  const cacheKey = `${windowMs}:${max}`;
  if (!limiters) limiters = new Map();
  if (limiters.has(cacheKey)) return limiters.get(cacheKey)!;

  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis }     = await import("@upstash/redis");

  const limiter = new Ratelimit({
    redis:   new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN }),
    limiter: Ratelimit.slidingWindow(max, `${Math.round(windowMs / 1000)} s`),
    analytics: false,
  });
  limiters.set(cacheKey, limiter);
  return limiter;
}

/* ── Public API ──────────────────────────────────────────────── */
export interface RateLimitResult {
  allowed:   boolean;
  remaining: number;
  resetAt:   number;
}

export interface RateLimitOptions {
  windowMs: number;
  max:      number;
}

export async function rateLimit(
  key: string,
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  try {
    const limiter = await getUpstashLimiter(opts.windowMs, opts.max);

    if (limiter) {
      const { success, remaining, reset } = await limiter.limit(key);
      return { allowed: success, remaining, resetAt: Number(reset) };
    }
  } catch {
    // If Redis call fails, fall through to in-memory
  }

  return memRateLimit(key, opts.windowMs, opts.max);
}

// Sync wrapper kept for callers that haven't been updated yet
export function rateLimitSync(key: string, opts: RateLimitOptions): RateLimitResult {
  return memRateLimit(key, opts.windowMs, opts.max);
}

/**
 * Rate-limit an authenticated endpoint by user ID.
 * Falls back to IP if userId is not provided.
 * Usage: await rateLimitUser(userId ?? ip, { windowMs, max })
 */
export async function rateLimitUser(
  identifier: string,
  opts: { windowMs: number; max: number }
): Promise<{ allowed: boolean; resetAt: number; remaining: number }> {
  return rateLimit(`user:${identifier}`, opts);
}
