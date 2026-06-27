import { describe, it, expect, beforeEach, vi } from "vitest";
import { revokeToken, isRevoked, hashToken } from "@/lib/tokenBlocklist";

const FAKE_TOKEN = "eyJhbGciOiJIUzI1NiJ9.fake.token";
const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const PAST_EXP   = Math.floor(Date.now() / 1000) - 1;   // already expired

describe("tokenBlocklist", () => {
  it("hashToken returns a 64-char hex string", () => {
    const h = hashToken(FAKE_TOKEN);
    expect(h).toHaveLength(64);
    expect(h).toMatch(/^[0-9a-f]+$/);
  });

  it("hashToken is deterministic", () => {
    expect(hashToken(FAKE_TOKEN)).toBe(hashToken(FAKE_TOKEN));
  });

  it("token is not revoked before revokeToken is called", async () => {
    expect(await isRevoked("some.fresh.token")).toBe(false);
  });

  it("revoked token is detected by isRevoked", async () => {
    const token = "token.to.revoke." + Date.now();
    await revokeToken(token, FUTURE_EXP);
    expect(await isRevoked(token)).toBe(true);
  });

  it("expired blocklist entry is treated as not revoked", async () => {
    const token = "token.already.expired." + Date.now();
    await revokeToken(token, PAST_EXP);
    // Entry was added with a past expiry — should be treated as clean
    expect(await isRevoked(token)).toBe(false);
  });

  it("different tokens don't collide", async () => {
    const t1 = "token.one." + Date.now();
    const t2 = "token.two." + Date.now();
    await revokeToken(t1, FUTURE_EXP);
    expect(await isRevoked(t1)).toBe(true);
    expect(await isRevoked(t2)).toBe(false);
  });
});
