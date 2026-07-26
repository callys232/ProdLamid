import { describe, it, expect } from "vitest";
import { validateIntelligenceResult } from "@/lib/intelligence/validateResult";

const LABELS = ["Identity Clarity", "Strategic Alignment", "Reputation Index", "Market Recognition"];

const good = {
  executiveSummary: "The organisation shows meaningful strategic drift between stated identity and operating reality.",
  kpis: [1, 2, 3, 4].map((i) => ({ label: `KPI ${i}`, value: `${i * 10}%`, trend: "trend text" })),
  signals: [
    { severity: "High",   title: "A", action: "do A" },
    { severity: "Medium", title: "B", action: "do B" },
    { severity: "Low",    title: "C", action: "do C" },
  ],
  dimensions: LABELS.map((l, i) => ({ label: l, value: 60 + i, insight: "x" })),
  distortionIndex: "Medium",
  correctionPriority: "Identity Realignment",
  correctionReason: "because",
  thirtyDayPlan: ["a", "b", "c"],
  ninetyDayPlan: ["d", "e", "f"],
};

describe("validateIntelligenceResult — accepts well-formed output", () => {
  it("passes a fully valid result unchanged", () => {
    const o = validateIntelligenceResult(good, LABELS);
    expect(o.ok).toBe(true);
    expect(o.repaired).toHaveLength(0);
    expect(o.result!.dimensions.map((d) => d.value)).toEqual([60, 61, 62, 63]);
  });
});

describe("validateIntelligenceResult — repairs LLM output drift", () => {
  it("coerces percent-string scores to numbers", () => {
    const o = validateIntelligenceResult(
      { ...good, dimensions: LABELS.map((l) => ({ label: l, value: "72%" })) },
      LABELS,
    );
    expect(o.ok).toBe(true);
    expect(o.result!.dimensions.every((d) => d.value === 72)).toBe(true);
  });

  it("rescales fractional scores to 0-100", () => {
    const o = validateIntelligenceResult(
      { ...good, dimensions: LABELS.map((l) => ({ label: l, value: 0.64 })) },
      LABELS,
    );
    expect(o.result!.dimensions.every((d) => d.value === 64)).toBe(true);
  });

  it("clamps out-of-range scores", () => {
    const o = validateIntelligenceResult(
      { ...good, dimensions: LABELS.map((l) => ({ label: l, value: 250 })) },
      LABELS,
    );
    expect(o.result!.dimensions.every((d) => d.value === 100)).toBe(true);
  });

  it("normalises unexpected severity values", () => {
    const o = validateIntelligenceResult(
      { ...good, signals: [{ severity: "critical", title: "T", action: "A" }] },
      LABELS,
    );
    expect(o.result!.signals[0].severity).toBe("High");
  });

  it("overrides model-invented dimension labels with the config labels", () => {
    const o = validateIntelligenceResult(
      {
        ...good,
        dimensions: [
          { label: "Made Up", value: 50 }, { label: "Other", value: 60 },
          { label: "X", value: 70 },       { label: "Y", value: 80 },
        ],
      },
      LABELS,
    );
    expect(o.result!.dimensions.map((d) => d.label)).toEqual(LABELS);
    expect(o.repaired.length).toBeGreaterThan(0);
  });

  it("trims an over-long signals array to three", () => {
    const o = validateIntelligenceResult({ ...good, signals: [...good.signals, ...good.signals] }, LABELS);
    expect(o.result!.signals).toHaveLength(3);
  });

  it("substitutes a missing ninety-day plan rather than failing", () => {
    const o = validateIntelligenceResult({ ...good, ninetyDayPlan: undefined }, LABELS);
    expect(o.ok).toBe(true);
    expect(o.result!.ninetyDayPlan.length).toBeGreaterThan(0);
  });
});

describe("validateIntelligenceResult — rejects unusable output", () => {
  it.each([
    ["an empty object", {}],
    ["null",            null],
    ["a missing KPI array", { ...good, kpis: [] }],
    ["an empty executive summary", { ...good, executiveSummary: "" }],
  ])("rejects %s", (_label, input) => {
    const o = validateIntelligenceResult(input, LABELS);
    expect(o.ok).toBe(false);
    expect(o.result).toBeUndefined();
    expect(o.reason).toBeTruthy();
  });
});
