import { describe, it, expect } from "vitest";
import { RegisterSchema, LoginSchema, EscrowFundSchema, escapeRegex, validate } from "@/lib/validation/schemas";

describe("RegisterSchema", () => {
  const valid = { name: "Jane Doe", email: "jane@example.com", password: "SecurePass1", role: "client" as const };

  it("accepts valid input", () => {
    const r = validate(RegisterSchema, valid);
    expect(r.success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const r = validate(RegisterSchema, { ...valid, name: "J" });
    expect(r.success).toBe(false);
    expect((r as any).errors[0]).toMatch(/2 characters/);
  });

  it("rejects invalid email", () => {
    const r = validate(RegisterSchema, { ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects password with no uppercase", () => {
    const r = validate(RegisterSchema, { ...valid, password: "securepass1" });
    expect(r.success).toBe(false);
    expect((r as any).errors[0]).toMatch(/uppercase/);
  });

  it("rejects password with no number", () => {
    const r = validate(RegisterSchema, { ...valid, password: "SecurePassword" });
    expect(r.success).toBe(false);
    expect((r as any).errors[0]).toMatch(/number/);
  });

  it("rejects password shorter than 8 chars", () => {
    const r = validate(RegisterSchema, { ...valid, password: "S3c!" });
    expect(r.success).toBe(false);
  });

  it("rejects invalid role", () => {
    const r = validate(RegisterSchema, { ...valid, role: "admin" });
    expect(r.success).toBe(false);
  });

  it("normalises email to lowercase", () => {
    const r = validate(RegisterSchema, { ...valid, email: "JANE@EXAMPLE.COM" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("jane@example.com");
  });
});

describe("LoginSchema", () => {
  it("accepts valid credentials", () => {
    const r = validate(LoginSchema, { email: "a@b.com", password: "pass" });
    expect(r.success).toBe(true);
  });

  it("rejects missing password", () => {
    const r = validate(LoginSchema, { email: "a@b.com", password: "" });
    expect(r.success).toBe(false);
  });
});

describe("EscrowFundSchema", () => {
  it("accepts valid escrowId", () => {
    const r = validate(EscrowFundSchema, { escrowId: "abc123" });
    expect(r.success).toBe(true);
  });

  it("rejects missing escrowId", () => {
    const r = validate(EscrowFundSchema, {});
    expect(r.success).toBe(false);
  });
});

describe("escapeRegex", () => {
  it("escapes special regex characters", () => {
    expect(escapeRegex("hello.*+?")).toBe("hello\\.\\*\\+\\?");
  });

  it("leaves normal strings unchanged", () => {
    expect(escapeRegex("hello world")).toBe("hello world");
  });

  it("escapes injection attempts", () => {
    const malicious = "(.*){99999}";
    const escaped   = escapeRegex(malicious);
    // Should not contain unescaped parens or braces
    expect(escaped).not.toMatch(/^\(/);
    expect(() => new RegExp(escaped)).not.toThrow();
  });
});
