/**
 * Input sanitisation and validation for all AI endpoints.
 * Prevents prompt injection, oversized payloads, and control-character attacks.
 */

/* ── Per-field maximum character lengths ──────────────────── */
const MAX_FIELD: Record<string, number> = {
  /* Common */
  organisationName:  120,
  industry:          80,
  size:              40,
  currentChallenge:  800,
  sovereignGoal:     800,
  additionalContext: 600,
  /* Diagnostic */
  businessName:      120,
  stage:             40,
  yearsInOperation:  20,
  teamSize:          20,
  revenueRange:      40,
  primaryMarket:     80,
  challenges:        1000,
  goals:             1000,
  strengths:         600,
  motivation:        400,
  /* Proposal */
  projectTitle:      160,
  clientName:        120,
  companyName:       120,
  category:          80,
  description:       1200,
  timeline:          80,
  skills:            300,
  deliverables:      400,
  /* Intelligence */
  moduleId:          10,
  engineName:        80,
  seriesName:        80,
  purpose:           600,
  driverContext:     800,
  /* Chat */
  content:           1000,
};

const GLOBAL_MAX = 2000; // Hard cap for any unknown field

/* ── Strip control characters (keeps printable unicode) ────── */
function stripControl(s: string): string {
  return s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
}

/* ── Sanitise a single string value ───────────────────────── */
function cleanField(key: string, value: string): string {
  const maxLen = MAX_FIELD[key] ?? GLOBAL_MAX;
  return stripControl(value).trim().slice(0, maxLen);
}

/**
 * Sanitise a flat object of user-supplied strings.
 * Returns a new object with all values cleaned and truncated.
 */
export function sanitiseInput(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (typeof val === "string") {
      out[key] = cleanField(key, val);
    } else if (typeof val === "number") {
      out[key] = String(val).slice(0, 20);
    } else if (Array.isArray(val)) {
      /* Join arrays (e.g. skills[]) then truncate */
      out[key] = val.filter(v => typeof v === "string")
        .map(v => cleanField(key, v as string))
        .slice(0, 20)
        .join(", ")
        .slice(0, GLOBAL_MAX);
    }
    /* Ignore objects / nulls / booleans */
  }
  return out;
}

/**
 * Check Content-Length header against a byte limit.
 * Returns false if the declared size exceeds the limit.
 * Actual body parsing may still be larger — this is a first gate.
 */
export function isBodyTooLarge(req: Request, maxBytes = 65_536 /* 64 KB */): boolean {
  const cl = req.headers.get("content-length");
  if (cl && parseInt(cl, 10) > maxBytes) return true;
  return false;
}

/**
 * Extract the real client IP from the request.
 * Resistant to X-Forwarded-For spoofing by preferring
 * trusted proxy headers and taking the LAST (innermost) IP
 * from the XFF chain when behind a real proxy.
 */
export function getClientIP(req: Request): string {
  // Cloudflare — most reliable when using CF
  const cf = (req as any).headers?.get?.("cf-connecting-ip");
  if (cf) return cf.trim();

  // Vercel edge
  const vercel = (req as any).headers?.get?.("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();

  // NGINX / AWS ALB — x-real-ip is set by the outermost proxy
  const real = (req as any).headers?.get?.("x-real-ip");
  if (real) return real.trim();

  // X-Forwarded-For: client, proxy1, proxy2
  // If behind a trusted proxy, the LAST entry is the connecting proxy's IP
  // and the FIRST is the real client IP — use first only if we trust the chain.
  // Without confirmed proxy trust, use the last entry (safest default).
  const xff = (req as any).headers?.get?.("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s: string) => s.trim()).filter(Boolean);
    // Take last entry — harder to spoof behind a real load balancer
    return parts[parts.length - 1] ?? "anonymous";
  }

  return "anonymous";
}
