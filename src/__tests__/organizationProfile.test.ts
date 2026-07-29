import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadProfile, saveProfile, hasProfile, profileCompleteness, EMPTY_PROFILE,
} from "@/lib/profile/organizationProfile";

/**
 * Minimal browser globals so the module's client branch runs under Node.
 * `window` matters as much as `localStorage` — the module guards every storage
 * call with `typeof window === "undefined"` so it is safe during SSR.
 */
function installStorage() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  };
  vi.stubGlobal("localStorage", localStorage);
  vi.stubGlobal("window", { localStorage });
  return store;
}

describe("organisation profile", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = installStorage();
    // saveProfile fires a sync; the network is not under test.
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, json: async () => ({}) })));
  });

  it("returns an empty profile when nothing is stored", () => {
    expect(loadProfile()).toEqual(EMPTY_PROFILE);
  });

  it("round-trips a saved profile", () => {
    saveProfile({ organisationName: "Meridian Logistics", industry: "Freight" });
    const p = loadProfile();
    expect(p.organisationName).toBe("Meridian Logistics");
    expect(p.industry).toBe("Freight");
  });

  it("merges patches instead of replacing the record", () => {
    saveProfile({ organisationName: "Meridian", industry: "Freight", headcount: 240 });
    saveProfile({ currency: "GBP" });

    const p = loadProfile();
    expect(p.currency).toBe("GBP");
    // The point of the shared profile: a tool that collects one field must not
    // wipe what the others already contributed.
    expect(p.organisationName).toBe("Meridian");
    expect(p.headcount).toBe(240);
  });

  it("ignores empty values so a blank field cannot erase a stored one", () => {
    saveProfile({ organisationName: "Meridian" });
    saveProfile({ organisationName: "", industry: "Freight" });

    const p = loadProfile();
    expect(p.organisationName).toBe("Meridian");
    expect(p.industry).toBe("Freight");
  });

  it("migrates the legacy per-intake cache on first load", () => {
    store.set("lamid-intake-context", JSON.stringify({
      organisationName: "Northwind Health", industry: "Healthcare", size: "201–500",
    }));

    const p = loadProfile();
    expect(p.organisationName).toBe("Northwind Health");
    expect(p.size).toBe("201–500");
    // And it is adopted, not re-read from the legacy key every time.
    expect(store.get("lamid-org-profile")).toBeTruthy();
  });

  it("survives corrupt storage rather than throwing", () => {
    store.set("lamid-org-profile", "{ not json");
    expect(loadProfile()).toEqual(EMPTY_PROFILE);
  });

  it("coerces unexpected field types", () => {
    store.set("lamid-org-profile", JSON.stringify({
      organisationName: 42, headcount: "not a number", periodLabel: "Fortnight",
    }));

    const p = loadProfile();
    expect(p.organisationName).toBe("");
    expect(p.headcount).toBeNull();
    expect(p.periodLabel).toBe("Month");
  });

  it("reports completeness and emptiness", () => {
    expect(hasProfile(EMPTY_PROFILE)).toBe(false);
    expect(profileCompleteness(EMPTY_PROFILE)).toBe(0);

    saveProfile({ organisationName: "Meridian", industry: "Freight" });
    const p = loadProfile();
    expect(hasProfile(p)).toBe(true);
    expect(profileCompleteness(p)).toBe(40); // 2 of 5 scored fields
  });
});
