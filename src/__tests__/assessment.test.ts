import { describe, it, expect } from "vitest";
import { computeAssessment, assessmentToPrompt } from "@/lib/intelligence/assessment";
import { assessmentDimensions } from "@/lib/intelligence/dimensions";
import type { AssessmentRow, EvidenceLevel } from "@/lib/intelligence/assessment";

const row = (label: string, rating: number, weight = 2, evidence: EvidenceLevel = 2): AssessmentRow =>
  ({ id: label, label, rating, weight, evidence });

describe("computeAssessment", () => {
  it("scores a rating as a percentage of the 0-5 scale", () => {
    expect(computeAssessment([row("A", 4)]).dimensions[0].scorePct).toBe(80);
  });

  it("weights the index by importance, not by count", () => {
    // Critical dimension at 0, useful one at 5 — a flat mean would say 50.
    const s = computeAssessment([row("Critical", 0, 3), row("Useful", 5, 1)]);
    expect(s.indexPct).toBeLessThan(50);
  });

  it("discounts a rating that has no evidence", () => {
    const evidenced = computeAssessment([row("A", 5, 2, 2)]).adjustedIndexPct;
    const asserted  = computeAssessment([row("A", 5, 2, 0)]).adjustedIndexPct;
    expect(asserted).toBeLessThan(evidenced);
  });

  it("flags a high rating with nothing behind it", () => {
    const s = computeAssessment([row("A", 5, 2, 0)]);
    expect(s.dimensions[0].unsupported).toBe(true);
    expect(s.warnings.some((w) => w.includes("rest on assertion"))).toBe(true);
  });

  it("does not flag a low rating as unsupported", () => {
    // Admitting a weakness needs no evidence.
    expect(computeAssessment([row("A", 1, 2, 0)]).dimensions[0].unsupported).toBe(false);
  });

  it("reports the spread that a mean would hide", () => {
    const s = computeAssessment([row("Strong", 5), row("Broken", 0)]);
    expect(s.spreadPts).toBe(100);
    expect(s.weakest?.label).toBe("Broken");
    expect(s.warnings.some((w) => w.includes("holding the overall score down"))).toBe(true);
  });

  it("ranks priorities by weight against shortfall, not by score alone", () => {
    const s = computeAssessment([
      row("MinorGap",    1, 1),   // worse score, barely matters
      row("CriticalGap", 2, 3),   // better score, matters far more
    ]);
    expect(s.priorities[0]).toBe("CriticalGap");
  });

  it("warns when nothing at all is documented", () => {
    const s = computeAssessment([row("A", 3, 2, 0), row("B", 3, 2, 1)]);
    expect(s.warnings.some((w) => w.includes("opinion rather than an assessment"))).toBe(true);
  });

  it("warns when every dimension carries the same weight", () => {
    const s = computeAssessment([row("A", 3), row("B", 3), row("C", 3)]);
    expect(s.warnings.some((w) => w.includes("same weight"))).toBe(true);
  });

  it("returns a usable shape with no rows rather than NaN", () => {
    const s = computeAssessment([]);
    expect(s.indexPct).toBe(0);
    expect(Number.isFinite(s.adjustedIndexPct)).toBe(true);
    expect(s.warnings.length).toBeGreaterThan(0);
  });

  it("clamps ratings and weights that arrive out of range", () => {
    const s = computeAssessment([{ id: "x", label: "X", rating: 99, weight: 9, evidence: 2 }]);
    expect(s.dimensions[0].scorePct).toBe(100);
    expect(s.dimensions[0].weight).toBe(3);
  });

  it("is deterministic", () => {
    const rows = [row("A", 4), row("B", 2, 3, 0)];
    expect(computeAssessment(rows)).toEqual(computeAssessment(rows));
  });
});

describe("assessment dimensions", () => {
  it("uses the module's own labels", () => {
    const d = assessmentDimensions(computeAssessment([row("Identity Clarity", 4)]));
    expect(d[0].label).toBe("Identity Clarity");
  });

  it("reports the evidence-adjusted value, not the raw one", () => {
    const d = assessmentDimensions(computeAssessment([row("A", 5, 2, 0)]));
    expect(d[0].value).toBeLessThan(100);
    expect(d[0].insight).toContain("no evidence");
  });
});

describe("assessmentToPrompt", () => {
  it("gives the model computed figures, never raw ratings to score", () => {
    // B is rated 5 with no evidence — only a HIGH unevidenced rating is flagged.
    const p = assessmentToPrompt(computeAssessment([row("A", 4), row("B", 5, 3, 0)]));
    expect(p).toContain("Weighted index");
    expect(p).toContain("evidence-adjusted");
    expect(p).toContain("UNSUPPORTED");
  });
});
