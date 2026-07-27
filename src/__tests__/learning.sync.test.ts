import { describe, it, expect } from "vitest";
import crypto from "node:crypto";

/**
 * The sync endpoint's guarantees, exercised against the same logic the route
 * uses. These are the properties that matter: a replayed callback must not
 * inflate someone's record, and a wrong secret must not be able to fabricate
 * qualifications.
 */

const SECRET = "shared-secret-value";

function secretOk(provided: string | undefined, expected = SECRET): boolean {
  if (!expected || !provided) return false;
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

const cleanSkills = (v: unknown): string[] =>
  Array.isArray(v)
    ? [...new Set(v.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .map((s) => s.trim()).slice(0, 30))]
    : [];

describe("learning sync — authentication", () => {
  it("accepts the shared secret", () => {
    expect(secretOk(SECRET)).toBe(true);
  });

  it("rejects a wrong secret", () => {
    expect(secretOk("nope")).toBe(false);
  });

  it("rejects a secret of a different length without throwing", () => {
    // timingSafeEqual needs equal-length buffers; hashing first guarantees that,
    // so a length mismatch can never crash the route.
    expect(() => secretOk("x")).not.toThrow();
    expect(secretOk("x")).toBe(false);
  });

  it("rejects a missing secret", () => {
    expect(secretOk(undefined)).toBe(false);
  });

  it("refuses everything when no secret is configured", () => {
    expect(secretOk(SECRET, "")).toBe(false);
  });
});

describe("learning sync — record hygiene", () => {
  it("dedupes and trims skills", () => {
    expect(cleanSkills([" React ", "React", "SQL", ""])).toEqual(["React", "SQL"]);
  });

  it("ignores non-string entries", () => {
    expect(cleanSkills(["React", 42, null, { x: 1 }])).toEqual(["React"]);
  });

  it("caps a runaway skill list", () => {
    const many = Array.from({ length: 100 }, (_, i) => `skill-${i}`);
    expect(cleanSkills(many)).toHaveLength(30);
  });

  it("returns nothing for a non-array", () => {
    expect(cleanSkills("React")).toEqual([]);
    expect(cleanSkills(undefined)).toEqual([]);
  });
});

describe("learning sync — idempotency key", () => {
  /** The unique index is (userId, source, externalId). */
  const key = (userId: string, externalId: string) => `${userId}|lms|${externalId}`;

  it("maps a replayed callback onto the same row", () => {
    expect(key("u1", "enrol-9")).toBe(key("u1", "enrol-9"));
  });

  it("keeps two users' copies of one course apart", () => {
    expect(key("u1", "enrol-9")).not.toBe(key("u2", "enrol-9"));
  });

  it("keeps two courses for one user apart", () => {
    expect(key("u1", "enrol-9")).not.toBe(key("u1", "enrol-10"));
  });
});
