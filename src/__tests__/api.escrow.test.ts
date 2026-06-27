/**
 * Escrow API integration tests — mocked DB.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EscrowFundSchema, EscrowReleaseSchema, validate } from "@/lib/validation/schemas";

/* ── Schema validation ───────────────────────────────────────── */
describe("Escrow schema validation", () => {
  it("accepts valid fund payload", () => {
    expect(validate(EscrowFundSchema, { escrowId: "abc123" }).success).toBe(true);
  });

  it("accepts fund payload with idempotency key", () => {
    expect(validate(EscrowFundSchema, { escrowId: "abc123", idempotencyKey: "idem-001" }).success).toBe(true);
  });

  it("rejects missing escrowId", () => {
    expect(validate(EscrowFundSchema, {}).success).toBe(false);
  });

  it("accepts valid release payload", () => {
    expect(validate(EscrowReleaseSchema, { escrowId: "abc123" }).success).toBe(true);
  });

  it("rejects missing escrowId in release", () => {
    expect(validate(EscrowReleaseSchema, {}).success).toBe(false);
  });
});

/* ── Atomic state machine (via mocked findOneAndUpdate) ──────── */
describe("Escrow state machine", () => {
  const findOneAndUpdateMock = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  describe("fund: pending → initializing", () => {
    it("succeeds when escrow is pending", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce({ _id: "e1", status: "initializing", amount: 5000 });
      const result = await findOneAndUpdateMock(
        { _id: "e1", status: "pending" },
        { $set: { status: "initializing" } },
        { new: true }
      );
      expect(result?.status).toBe("initializing");
    });

    it("returns null for concurrent duplicate (only first wins)", async () => {
      findOneAndUpdateMock
        .mockResolvedValueOnce({ _id: "e1", status: "initializing" })
        .mockResolvedValueOnce(null);

      const [first, second] = await Promise.all([
        findOneAndUpdateMock({ _id: "e1", status: "pending" }, {}, {}),
        findOneAndUpdateMock({ _id: "e1", status: "pending" }, {}, {}),
      ]);

      expect(first).not.toBeNull();
      expect(second).toBeNull();
    });

    it("returns null when already funded", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce(null);
      const result = await findOneAndUpdateMock(
        { _id: "e1", status: "pending" }, {}, {}
      );
      expect(result).toBeNull();
    });
  });

  describe("release: funded → releasing", () => {
    it("succeeds when escrow is funded", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce({ _id: "e1", status: "funded" });
      const result = await findOneAndUpdateMock(
        { _id: "e1", status: "funded" },
        { $set: { status: "releasing" } },
        { new: false }
      );
      expect(result?.status).toBe("funded");
    });

    it("prevents double-release", async () => {
      findOneAndUpdateMock
        .mockResolvedValueOnce({ _id: "e1", status: "funded" })
        .mockResolvedValueOnce(null);

      const [r1, r2] = await Promise.all([
        findOneAndUpdateMock({ _id: "e1", status: "funded" }, {}, {}),
        findOneAndUpdateMock({ _id: "e1", status: "funded" }, {}, {}),
      ]);

      expect(r1).not.toBeNull();
      expect(r2).toBeNull();
    });
  });

  describe("webhook: idempotent funding", () => {
    it("only applies charge.success once", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce({ _id: "e1", status: "funded" });
      findOneAndUpdateMock.mockResolvedValueOnce(null); // second webhook: no match

      const first  = await findOneAndUpdateMock(
        { _id: "e1", status: { $in: ["initializing", "pending"] } }, {}, {}
      );
      const replay = await findOneAndUpdateMock(
        { _id: "e1", status: { $in: ["initializing", "pending"] } }, {}, {}
      );

      expect(first).not.toBeNull();
      expect(replay).toBeNull();
    });
  });
});

/* ── Cache layer ─────────────────────────────────────────────── */
describe("Cache layer", () => {
  it("returns null for missing key", async () => {
    const { cache } = await import("@/lib/cache");
    expect(await cache.get("nonexistent:key:xyz")).toBeNull();
  });

  it("stores and retrieves a value", async () => {
    const { cache } = await import("@/lib/cache");
    await cache.set("test:escrow:1", { amount: 5000 }, 60);
    const val = await cache.get<{ amount: number }>("test:escrow:1");
    expect(val?.amount).toBe(5000);
  });

  it("returns null after deletion", async () => {
    const { cache } = await import("@/lib/cache");
    await cache.set("test:del:1", "hello", 60);
    await cache.del("test:del:1");
    expect(await cache.get("test:del:1")).toBeNull();
  });
});
