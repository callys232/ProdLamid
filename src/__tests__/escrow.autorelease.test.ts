import { describe, it, expect } from "vitest";
import {
  AUTO_RELEASE_DAYS, AUTO_RELEASE_MS, autoReleaseDeadline,
  autoReleaseWindowLabel, BLOCKS_AUTO_RELEASE,
} from "@/lib/escrow/autoReleasePolicy";

describe("auto-release policy", () => {
  it("waits days, not a single night", () => {
    expect(AUTO_RELEASE_DAYS).toBeGreaterThanOrEqual(2);
    // The old behaviour released after 12 hours.
    expect(AUTO_RELEASE_MS).toBeGreaterThan(12 * 60 * 60 * 1000);
  });

  it("defaults to a week of silence", () => {
    expect(AUTO_RELEASE_DAYS).toBe(7);
  });

  it("measures the deadline from the certification moment", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    expect(autoReleaseDeadline(from).getTime() - from.getTime()).toBe(AUTO_RELEASE_MS);
  });

  it("labels the window so notification copy tracks the setting", () => {
    expect(autoReleaseWindowLabel()).toBe(`${AUTO_RELEASE_DAYS} days`);
  });

  it("treats a dispute as a hard stop", () => {
    expect(BLOCKS_AUTO_RELEASE).toContain("dispute");
  });

  it("never re-releases work already approved or released", () => {
    expect(BLOCKS_AUTO_RELEASE).toContain("approved");
    expect(BLOCKS_AUTO_RELEASE).toContain("released");
  });
});
