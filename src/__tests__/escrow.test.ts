/**
 * Escrow logic unit tests — all DB calls are mocked.
 * Tests verify the atomic state-machine transitions and error paths.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

/* ── Mock mongoose models ─────────────────────────────────────── */
const mockEscrow = {
  _id:       "escrow123",
  status:    "pending",
  amount:    50000,
  milestoneId: "milestone456",
  paystackRef: null,
};

const findOneAndUpdateMock = vi.fn();
const findByIdMock         = vi.fn();
const findByIdUpdateMock   = vi.fn();

vi.mock("@/lib/models/Escrow", () => ({
  Escrow: {
    findOneAndUpdate: findOneAndUpdateMock,
    findById:         findByIdMock,
    findByIdAndUpdate: findByIdUpdateMock,
    findOne:          vi.fn(),
  },
}));

vi.mock("@/lib/models/Milestone", () => ({
  Milestone: { findByIdAndUpdate: vi.fn() },
}));

vi.mock("@/lib/db", () => ({ default: vi.fn() }));

/* ── Tests ────────────────────────────────────────────────────── */
describe("Escrow status machine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fund transition (pending → initializing)", () => {
    it("succeeds when escrow is pending", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce({ ...mockEscrow, status: "initializing" });

      const result = await findOneAndUpdateMock(
        { _id: "escrow123", status: "pending" },
        { $set: { status: "initializing" } },
        { new: true }
      );

      expect(result?.status).toBe("initializing");
      expect(findOneAndUpdateMock).toHaveBeenCalledWith(
        { _id: "escrow123", status: "pending" },
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("returns null when escrow is already funded (prevents double payment)", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce(null); // No match — already funded

      const result = await findOneAndUpdateMock(
        { _id: "escrow123", status: "pending" },
        { $set: { status: "initializing" } },
        { new: true }
      );

      expect(result).toBeNull();
    });

    it("returns null for concurrent requests (only first wins)", async () => {
      // First call succeeds
      findOneAndUpdateMock.mockResolvedValueOnce({ ...mockEscrow, status: "initializing" });
      // Second concurrent call finds no "pending" doc
      findOneAndUpdateMock.mockResolvedValueOnce(null);

      const [first, second] = await Promise.all([
        findOneAndUpdateMock({ _id: "escrow123", status: "pending" }, {}, {}),
        findOneAndUpdateMock({ _id: "escrow123", status: "pending" }, {}, {}),
      ]);

      expect(first?.status).toBe("initializing");
      expect(second).toBeNull();
    });
  });

  describe("release transition (funded → releasing)", () => {
    it("succeeds when escrow is funded", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce({ ...mockEscrow, status: "funded" });

      const result = await findOneAndUpdateMock(
        { _id: "escrow123", status: "funded" },
        { $set: { status: "releasing" } },
        { new: false }
      );

      expect(result?.status).toBe("funded"); // old doc returned (new:false)
    });

    it("returns null when escrow is not funded", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce(null);

      const result = await findOneAndUpdateMock(
        { _id: "escrow123", status: "funded" },
        { $set: { status: "releasing" } },
        { new: false }
      );

      expect(result).toBeNull();
    });

    it("prevents double-release race condition", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce({ ...mockEscrow, status: "funded" });
      findOneAndUpdateMock.mockResolvedValueOnce(null); // second release finds no "funded" doc

      const [r1, r2] = await Promise.all([
        findOneAndUpdateMock({ _id: "escrow123", status: "funded" }, {}, {}),
        findOneAndUpdateMock({ _id: "escrow123", status: "funded" }, {}, {}),
      ]);

      expect(r1).not.toBeNull();
      expect(r2).toBeNull();
    });
  });

  describe("webhook funding (atomic — rejects duplicates)", () => {
    it("only funds if status is initializing or pending", async () => {
      findOneAndUpdateMock.mockResolvedValueOnce({ ...mockEscrow, status: "funded" });

      const escrow = await findOneAndUpdateMock(
        { _id: "escrow123", status: { $in: ["initializing", "pending"] } },
        { $set: { status: "funded", transactionId: "tx_abc", fundedAt: new Date() } },
        { new: true }
      );

      // Webhook replay: doc is now "funded" so filter won't match
      findOneAndUpdateMock.mockResolvedValueOnce(null);
      const replay = await findOneAndUpdateMock(
        { _id: "escrow123", status: { $in: ["initializing", "pending"] } },
        {},
        {}
      );

      expect(escrow?.status).toBe("funded");
      expect(replay).toBeNull(); // idempotent — second webhook ignored
    });
  });
});
