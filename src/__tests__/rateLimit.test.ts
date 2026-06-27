import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit } from "@/lib/rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests within the limit", async () => {
    const result = await rateLimit("test:ip1", { windowMs: 60_000, max: 3 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests that exceed the limit", async () => {
    await rateLimit("test:ip2", { windowMs: 60_000, max: 2 });
    await rateLimit("test:ip2", { windowMs: 60_000, max: 2 });
    const result = await rateLimit("test:ip2", { windowMs: 60_000, max: 2 });
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after the window expires", async () => {
    await rateLimit("test:ip3", { windowMs: 1_000, max: 1 });
    const blocked = await rateLimit("test:ip3", { windowMs: 1_000, max: 1 });
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(1_001);

    const reset = await rateLimit("test:ip3", { windowMs: 1_000, max: 1 });
    expect(reset.allowed).toBe(true);
  });

  it("tracks different keys independently", async () => {
    await rateLimit("test:a", { windowMs: 60_000, max: 1 });
    const blocked = await rateLimit("test:a", { windowMs: 60_000, max: 1 });
    const other   = await rateLimit("test:b", { windowMs: 60_000, max: 1 });

    expect(blocked.allowed).toBe(false);
    expect(other.allowed).toBe(true);
  });

  it("returns a valid resetAt timestamp", async () => {
    const before = Date.now();
    const result = await rateLimit("test:ts", { windowMs: 5_000, max: 10 });
    expect(result.resetAt).toBeGreaterThanOrEqual(before + 5_000);
  });
});
