/**
 * The organisation profile — entered once, read by every tool.
 *
 * Before this existed each of the 245 tools collected its own organisation
 * name, industry, headcount and currency from scratch, so figures typed into
 * one tool were gone by the time the next one asked for them. This is the
 * shared record they all prefill from.
 *
 * Local-first by design: a visitor who has not signed up still gets prefill
 * across tools, and a member's profile syncs to the server so it follows them
 * between devices. The local copy is always written first — a failed sync must
 * never cost someone the figures they just typed.
 */

export interface OrganizationProfile {
  organisationName: string;
  industry:         string;
  /** Headcount band — what the narrative intakes ask for. */
  size:             string;
  /** Exact headcount, when known. Roster and financial tools use it. */
  headcount:        number | null;
  currency:         string;
  region:           string;
  /** What a "period" means for this organisation's reporting. */
  periodLabel:      "Month" | "Quarter" | "Week";
  updatedAt:        string | null;
}

export const EMPTY_PROFILE: OrganizationProfile = {
  organisationName: "",
  industry:         "",
  size:             "",
  headcount:        null,
  currency:         "USD",
  region:           "",
  periodLabel:      "Month",
  updatedAt:        null,
};

const KEY = "lamid-org-profile";
/** The per-module intake cache this profile replaces. Read once, then retired. */
const LEGACY_KEY = "lamid-intake-context";

/** Narrow unknown JSON to a profile without trusting any of its fields. */
function coerce(raw: unknown): OrganizationProfile {
  if (!raw || typeof raw !== "object") return { ...EMPTY_PROFILE };
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
  const num = (v: unknown) => (Number.isFinite(Number(v)) && v !== "" && v !== null ? Number(v) : null);
  const period = str(r.periodLabel, "Month");

  return {
    organisationName: str(r.organisationName),
    industry:         str(r.industry),
    size:             str(r.size),
    headcount:        num(r.headcount),
    currency:         str(r.currency, "USD") || "USD",
    region:           str(r.region),
    periodLabel:      period === "Quarter" || period === "Week" ? period : "Month",
    updatedAt:        typeof r.updatedAt === "string" ? r.updatedAt : null,
  };
}

/** True when the profile carries enough to be worth prefilling from. */
export function hasProfile(p: OrganizationProfile): boolean {
  return Boolean(p.organisationName || p.industry || p.headcount || p.size);
}

/** How complete the profile is, 0–100 — drives the workspace prompt to finish it. */
export function profileCompleteness(p: OrganizationProfile): number {
  const fields = [p.organisationName, p.industry, p.size, p.headcount, p.region];
  const filled = fields.filter((f) => f !== null && f !== undefined && f !== "").length;
  return Math.round((filled / fields.length) * 100);
}

export function loadProfile(): OrganizationProfile {
  if (typeof window === "undefined") return { ...EMPTY_PROFILE };
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return coerce(JSON.parse(saved));

    /* First run since the profile shipped: adopt whatever the old per-intake
       cache held so existing users don't start from an empty form. */
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = coerce(JSON.parse(legacy));
      writeLocal(migrated);
      return migrated;
    }
  } catch {
    /* unavailable or corrupt storage — an empty profile is the safe answer */
  }
  return { ...EMPTY_PROFILE };
}

function writeLocal(p: OrganizationProfile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch { /* storage full or blocked — not worth interrupting a run */ }
}

/**
 * Merge a patch into the stored profile. Only non-empty values overwrite, so a
 * tool that asks for three of the seven fields can save what it collected
 * without blanking the rest.
 */
export function saveProfile(patch: Partial<OrganizationProfile>): OrganizationProfile {
  const current = loadProfile();
  const next: OrganizationProfile = { ...current };

  const writable = next as unknown as Record<string, unknown>;
  for (const [k, v] of Object.entries(patch)) {
    if (v === "" || v === null || v === undefined) continue;
    writable[k] = v;
  }
  next.updatedAt = new Date().toISOString();

  writeLocal(next);
  void syncUp(next);
  return next;
}

/** Push to the server. Members get a stored profile; everyone else is a no-op. */
async function syncUp(p: OrganizationProfile): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/profile/organization", {
      method:      "PUT",
      headers:     { "Content-Type": "application/json" },
      credentials: "include",
      body:        JSON.stringify(p),
    });
  } catch { /* offline or signed out — the local copy is still authoritative */ }
}

/**
 * Pull the server copy and adopt it when it is newer than the local one.
 * Returns the profile that should now be used.
 */
export async function syncDown(): Promise<OrganizationProfile> {
  const local = loadProfile();
  if (typeof window === "undefined") return local;

  try {
    const res = await fetch("/api/profile/organization", { credentials: "include" });
    if (!res.ok) return local;
    const body = await res.json();
    if (!body?.data) return local;

    const remote = coerce(body.data);
    const rAt = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
    const lAt = local.updatedAt ? Date.parse(local.updatedAt) : 0;

    if (rAt > lAt) {
      writeLocal(remote);
      return remote;
    }
    /* Local is ahead — most likely filled in while signed out. Push it up. */
    if (lAt > rAt && hasProfile(local)) void syncUp(local);
  } catch { /* network failure is not a reason to lose the local profile */ }

  return local;
}
