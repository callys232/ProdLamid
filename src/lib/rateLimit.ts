// In-memory rate limiter (no Redis dependency)
// For production at scale, swap the store for an external Redis instance.

interface Entry { count: number; resetAt: number }

const store = new Map<string, Entry>();

interface RateLimitOptions {
  windowMs: number;   // window in milliseconds
  max:      number;   // max requests per window
}

export function rateLimit(key: string, opts: RateLimitOptions): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, remaining: opts.max - 1, resetAt: now + opts.windowMs };
  }

  entry.count += 1;

  if (entry.count > opts.max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: opts.max - entry.count, resetAt: entry.resetAt };
}

// Purge stale entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (now > v.resetAt) store.delete(k);
  }
}, 10 * 60 * 1000);
