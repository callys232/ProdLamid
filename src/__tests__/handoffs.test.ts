import { describe, it, expect } from "vitest";
import { handoffsFor } from "@/lib/intelligence/handoffs";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

describe("cross-tool handoffs", () => {
  it("suggests where a finance finding is acted on next", () => {
    const next = handoffsFor("F04");
    expect(next.length).toBeGreaterThan(0);
    expect(next.map((h) => h.to)).toContain("Q46");
  });

  it("returns nothing for a tool with no defined follow-on", () => {
    expect(handoffsFor("Z14")).toEqual([]);
    expect(handoffsFor("NOPE")).toEqual([]);
  });

  it("resolves every target to a real tool name", () => {
    const withHandoffs = ["F01", "F04", "F02", "F05", "R14", "R03", "R05", "P01",
                          "A21", "A25", "A26", "Q46", "Q59", "S03", "X03", "X06"];

    for (const id of withHandoffs) {
      const next = handoffsFor(id);
      expect(next.length, `${id} should have handoffs`).toBeGreaterThan(0);

      for (const h of next) {
        // A suggestion pointing at a tool that does not exist would render a
        // dead card, which is worse than showing nothing.
        expect(MODULE_REGISTRY[h.to], `${id} → ${h.to} must exist`).toBeDefined();
        expect(h.name).toBe(MODULE_REGISTRY[h.to].engineName);
        expect(h.href).toMatch(/^\/[a-z0-9-]+$/);
        expect(h.reason.length).toBeGreaterThan(20);
      }
    }
  });

  it("never suggests the tool the reader just ran", () => {
    for (const id of Object.keys(MODULE_REGISTRY)) {
      expect(handoffsFor(id).map((h) => h.to)).not.toContain(id);
    }
  });
});
