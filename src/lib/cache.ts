/**
 * Cache layer — Upstash Redis when configured, in-memory fallback for dev.
 *
 * Set REDIS_URL + REDIS_TOKEN in .env to enable Redis.
 * Without those vars the in-memory fallback is used automatically.
 */

/* ── In-memory fallback ───────────────────────────────────────── */
interface MemEntry { value: string; expiresAt: number }
const mem = new Map<string, MemEntry>();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of mem) if (now > v.expiresAt) mem.delete(k);
}, 60_000);

const memCache = {
  async get(key: string) {
    const e = mem.get(key);
    if (!e || Date.now() > e.expiresAt) return null;
    return e.value;
  },
  async set(key: string, value: string, ttl: number) {
    mem.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
  },
  async del(key: string) { mem.delete(key); },
  async keys(pattern: string) {
    const re = new RegExp("^" + pattern.replace("*", ".*") + "$");
    return [...mem.keys()].filter(k => re.test(k));
  },
};

/* ── Upstash Redis ────────────────────────────────────────────── */
async function getRedis() {
  if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) return null;
  const { Redis } = await import("@upstash/redis");
  return new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });
}

let _redis: Awaited<ReturnType<typeof getRedis>> | undefined;
async function redis() {
  if (_redis === undefined) _redis = await getRedis();
  return _redis;
}

/* ── Public API ───────────────────────────────────────────────── */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const r = await redis();
      const raw = r ? await r.get<string>(key) : await memCache.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch { return null; }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      const raw = JSON.stringify(value);
      const r = await redis();
      if (r) await r.set(key, raw, { ex: ttlSeconds });
      else    await memCache.set(key, raw, ttlSeconds);
    } catch { /* cache miss is non-fatal */ }
  },

  async del(key: string): Promise<void> {
    try {
      const r = await redis();
      if (r) await r.del(key);
      else    await memCache.del(key);
    } catch { /* non-fatal */ }
  },

  /** Invalidate all keys matching a prefix pattern e.g. "projects:*" */
  async invalidate(pattern: string): Promise<void> {
    try {
      const r = await redis();
      if (r) {
        const keys = await r.keys(pattern);
        if (keys.length) await r.del(...keys);
      } else {
        const keys = await memCache.keys(pattern);
        keys.forEach(k => mem.delete(k));
      }
    } catch { /* non-fatal */ }
  },
};

/* ── Cache key helpers ────────────────────────────────────────── */
export const CacheKeys = {
  consultants:   (page: number, filters: string) => `consultants:${page}:${filters}`,
  project:       (id: string)                     => `project:${id}`,
  projectsBrowse:(page: number, cat: string)      => `projects:browse:${page}:${cat}`,
  userProfile:   (id: string)                     => `user:profile:${id}`,
  orgMembers:    (orgId: string)                  => `org:members:${orgId}`,
  notifications: (userId: string)                 => `notifications:${userId}`,
};

/* ── TTL constants (seconds) ─────────────────────────────────── */
export const TTL = {
  SHORT:    30,    // live data: project listings, notifications
  MEDIUM:   120,   // semi-live: consultant browse, user profiles
  LONG:     600,   // slow-changing: org members, analytics
  DAY:      86400, // static: reference data
};
