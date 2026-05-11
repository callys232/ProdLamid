/**
 * Auth API integration tests.
 * All DB and external service calls are mocked.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterSchema, LoginSchema, validate } from "@/lib/validation/schemas";

/* ── Mock external dependencies ──────────────────────────────── */
vi.mock("@/lib/db",              () => ({ default: vi.fn() }));
vi.mock("@/lib/mailer",          () => ({ sendVerificationEmail: vi.fn() }));
vi.mock("@/lib/services/pointsService", () => ({
  awardPoints: vi.fn(),
  SIGNUP_BONUS: { client: 100, seller: 150, enterprise: 500 },
}));
// Do NOT mock tokenBlocklist — we test the real implementation below

/* ── Register validation ─────────────────────────────────────── */
describe("Register — input validation", () => {
  const valid = {
    name: "Jane Doe", email: "jane@example.com",
    password: "SecurePass1", role: "client" as const,
  };

  it("accepts a valid registration payload", () => {
    expect(validate(RegisterSchema, valid).success).toBe(true);
  });

  it("rejects short name", () => {
    const r = validate(RegisterSchema, { ...valid, name: "J" });
    expect(r.success).toBe(false);
  });

  it("rejects bad email format", () => {
    const r = validate(RegisterSchema, { ...valid, email: "not-email" });
    expect(r.success).toBe(false);
  });

  it("rejects weak password — no uppercase", () => {
    const r = validate(RegisterSchema, { ...valid, password: "weakpassword1" });
    expect(r.success).toBe(false);
    expect((r as any).errors[0]).toMatch(/uppercase/i);
  });

  it("rejects weak password — no number", () => {
    const r = validate(RegisterSchema, { ...valid, password: "WeakPassword" });
    expect(r.success).toBe(false);
    expect((r as any).errors[0]).toMatch(/number/i);
  });

  it("rejects invalid role", () => {
    const r = validate(RegisterSchema, { ...valid, role: "hacker" });
    expect(r.success).toBe(false);
  });

  it("normalises email to lowercase", () => {
    const r = validate(RegisterSchema, { ...valid, email: "JANE@EXAMPLE.COM" });
    expect(r.success && r.data.email).toBe("jane@example.com");
  });
});

/* ── Login validation ────────────────────────────────────────── */
describe("Login — input validation", () => {
  it("accepts valid credentials", () => {
    expect(validate(LoginSchema, { email: "a@b.com", password: "pass" }).success).toBe(true);
  });

  it("rejects missing password", () => {
    expect(validate(LoginSchema, { email: "a@b.com", password: "" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(validate(LoginSchema, { email: "notanemail", password: "pass" }).success).toBe(false);
  });
});

/* ── Rate limiter behaviour in auth context ──────────────────── */
describe("Rate limiter — auth routes", () => {
  it("allows first request for a fresh key", async () => {
    const { rateLimit } = await import("@/lib/rateLimit");
    const result = await rateLimit(`test-auth-${Date.now()}`, { windowMs: 60_000, max: 5 });
    expect(result.allowed).toBe(true);
  });

  it("blocks after exceeding max", async () => {
    const { rateLimit } = await import("@/lib/rateLimit");
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 3; i++) await rateLimit(key, { windowMs: 60_000, max: 3 });
    const last = await rateLimit(key, { windowMs: 60_000, max: 3 });
    expect(last.allowed).toBe(false);
  });
});

/* ── Token blocklist in auth middleware ──────────────────────── */
describe("Token blocklist", () => {
  it("revoked token is detected", async () => {
    const { revokeToken, isRevoked } = await import("@/lib/tokenBlocklist");
    const token = `fake.jwt.${Date.now()}`;
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    await revokeToken(token, futureExp);
    expect(await isRevoked(token)).toBe(true);
  });

  it("non-revoked token passes through", async () => {
    const { isRevoked } = await import("@/lib/tokenBlocklist");
    expect(await isRevoked(`fresh.token.${Date.now()}`)).toBe(false);
  });
});
