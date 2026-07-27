import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  savePendingRun, loadPendingRun, clearPendingRun, currentReturnPath,
} from "@/lib/intelligence/pendingRun";

const mem = () => {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null, length: 0,
  } as unknown as Storage;
};

beforeEach(() => {
  vi.stubGlobal("window", {
    sessionStorage: mem(),
    location: { pathname: "/q46-predictive-foresight", search: "" },
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("pending run hand-off", () => {
  const run = { moduleId: "Q46", context: { organisationName: "Horizon" }, measured: "EV 70,000" };

  it("returns the run saved for that module", () => {
    savePendingRun(run);
    expect(loadPendingRun("Q46")?.context.organisationName).toBe("Horizon");
  });

  it("never returns another module's run", () => {
    savePendingRun(run);
    // Restoring one engine's numbers into another is worse than starting again.
    expect(loadPendingRun("F02")).toBeNull();
  });

  it("returns nothing once cleared", () => {
    savePendingRun(run);
    clearPendingRun();
    expect(loadPendingRun("Q46")).toBeNull();
  });

  it("discards a run that has gone stale", () => {
    savePendingRun(run);
    const raw = JSON.parse(window.sessionStorage.getItem("lamid-pending-run")!);
    raw.savedAt = Date.now() - 60 * 60 * 1000;      // an hour ago
    window.sessionStorage.setItem("lamid-pending-run", JSON.stringify(raw));
    expect(loadPendingRun("Q46")).toBeNull();
  });

  it("survives corrupt storage without throwing", () => {
    window.sessionStorage.setItem("lamid-pending-run", "{ not json");
    expect(loadPendingRun("Q46")).toBeNull();
  });

  it("carries the computed dimensions across the detour", () => {
    savePendingRun({ ...run, dimensions: [{ label: "Expected Return", value: 72, insight: "x" }] });
    expect(loadPendingRun("Q46")?.dimensions?.[0].value).toBe(72);
  });

  it("returns a same-origin path for the auth links", () => {
    expect(currentReturnPath()).toBe("/q46-predictive-foresight");
  });

  it("refuses a protocol-relative path that would leave the site", () => {
    vi.stubGlobal("window", {
      sessionStorage: mem(),
      location: { pathname: "//evil.example/steal", search: "" },
    });
    expect(currentReturnPath()).toBe("/");
  });
});
