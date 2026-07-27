import { describe, it, expect } from "vitest";
import { computeCareerPath } from "@/lib/talent/careerPath";
import { requirementsFor, TARGET_ROLES } from "@/lib/talent/roleCatalogue";

const reqs = [
  { skill: "SQL",               needed: 5, weight: 5 },
  { skill: "Data visualisation", needed: 4, weight: 4 },
  { skill: "Statistics",        needed: 4, weight: 2 },
];

const base = { currentRole: "Analyst", targetRole: "Data Analyst", requirements: reqs };

describe("career path readiness", () => {
  it("counts a requirement met only when the level is reached", () => {
    const r = computeCareerPath({ ...base, skills: [{ name: "SQL", level: 5 }], learning: [] });
    expect(r.met.map((m) => m.skill)).toEqual(["SQL"]);
    expect(r.readinessPct).toBeCloseTo(33.3, 0);
  });

  it("ranks gaps by shortfall times weight, not by shortfall alone", () => {
    // Statistics is further behind, but SQL matters far more to the role.
    const r = computeCareerPath({
      ...base,
      skills: [{ name: "SQL", level: 3 }, { name: "Statistics", level: 1 }, { name: "Data visualisation", level: 4 }],
      learning: [],
    });
    // SQL is only 2 levels short but weight 5 -> priority 10.
    // Statistics is 3 short at weight 2 -> priority 6. Weight decides the order.
    expect(r.gaps[0].skill).toBe("SQL");
    expect(r.gaps[1].skill).toBe("Statistics");
    expect(r.gaps[0].priority).toBe(10);
    expect(r.gaps[1].priority).toBe(6);
  });

  it("treats completed learning as evidence, lifting a skill to competent", () => {
    const r = computeCareerPath({
      ...base, skills: [],
      learning: [{ title: "SQL Foundations", covers: ["SQL"], hours: 12, certified: true }],
    });
    const sql = [...r.met, ...r.gaps].find((g) => g.skill === "SQL")!;
    expect(sql.held).toBe(3);
    expect(sql.evidencedBy).toContain("SQL Foundations");
  });

  it("never lets a course alone satisfy a level-5 requirement", () => {
    const r = computeCareerPath({
      ...base, skills: [],
      learning: [{ title: "SQL Foundations", covers: ["SQL"] }],
    });
    // Evidence of competence is not evidence of mastery.
    expect(r.gaps.some((g) => g.skill === "SQL")).toBe(true);
  });

  it("flags learning that maps to nothing the role asks for", () => {
    const r = computeCareerPath({
      ...base, skills: [],
      learning: [{ title: "Pottery", covers: ["Ceramics"] }],
    });
    expect(r.offPathLearning).toEqual(["Pottery"]);
  });

  it("names requirements with no skill and no evidence at all", () => {
    const r = computeCareerPath({ ...base, skills: [{ name: "SQL", level: 5 }], learning: [] });
    expect(r.untouched).toContain("Statistics");
  });

  it("weights readiness so a near miss on a critical skill beats a total miss", () => {
    const near = computeCareerPath({ ...base, skills: [{ name: "SQL", level: 4 }], learning: [] });
    const none = computeCareerPath({ ...base, skills: [{ name: "Statistics", level: 4 }], learning: [] });
    expect(near.weightedReadiness).toBeGreaterThan(none.weightedReadiness);
  });

  it("returns a usable result with no target requirements", () => {
    const r = computeCareerPath({ ...base, requirements: [], skills: [], learning: [] });
    expect(r.readinessPct).toBe(0);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it("says so when current and target role are the same", () => {
    const r = computeCareerPath({
      ...base, currentRole: "Data Analyst", skills: [], learning: [],
    });
    expect(r.warnings.some((w) => w.includes("no gap"))).toBe(true);
  });

  it("keeps the strongest claim when a skill is listed twice", () => {
    const r = computeCareerPath({
      ...base, skills: [{ name: "SQL", level: 2 }, { name: "sql", level: 5 }], learning: [],
    });
    expect(r.met.some((m) => m.skill === "SQL")).toBe(true);
  });

  it("ships requirements for every role in the catalogue", () => {
    for (const role of TARGET_ROLES) expect(requirementsFor(role).length).toBeGreaterThan(0);
  });
});
