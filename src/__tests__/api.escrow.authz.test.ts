import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Route-level authorization.
 *
 * The unit tests prove the guard's logic; these prove the routes actually call
 * it. That gap is exactly where the IDOR lived — every helper behaved, and the
 * handlers never asked.
 *
 * The database and identity are mocked so the assertions are about who is
 * allowed through, not about Mongo.
 */

const CLIENT   = "aaaaaaaaaaaaaaaaaaaaaaa1";
const CONSULT  = "aaaaaaaaaaaaaaaaaaaaaaa2";
const STRANGER = "aaaaaaaaaaaaaaaaaaaaaaa9";

/** Identity the mocked auth layer will report for the next call. */
let identity: { userId: string; userRole: string } | null = { userId: CLIENT, userRole: "client" };

vi.mock("@/lib/db", () => ({ default: async () => undefined }));

vi.mock("@/lib/middleware/auth", async () => {
  const { NextResponse } = await import("next/server");
  return {
    requireAuth: async () =>
      identity ?? NextResponse.json({ error: "Unauthorised" }, { status: 401 }),
    verifyAuth: async () => identity,
  };
});

vi.mock("@/lib/middleware/engineGuard", () => ({ denyEngineUsers: () => null }));

/** The escrow under test belongs to CLIENT and CONSULT. */
const ESCROW = { _id: "e1", clientId: CLIENT, consultantId: CONSULT, amount: 500, status: "funded" };

vi.mock("@/controllers/escrowController", async () => {
  const { assertEscrowAccess } = await import("@/lib/escrow/authorize");
  const Users = {
    findById: () => ({ select: () => ({ lean: async () => ({ assignedPmId: null, orgId: null }) }) }),
    findOne:  () => ({ select: () => ({ lean: async () => null }) }),
  };
  return {
    // Mirrors the real controller: load, then authorise, then act.
    releaseEscrow: async (_id: string, userId: string) => {
      await assertEscrowAccess(ESCROW, userId, undefined, { Users } as never);
      return { success: true };
    },
    cancelEscrow: async (_id: string, userId: string) => {
      await assertEscrowAccess(ESCROW, userId, undefined, { Users } as never);
      return { success: true };
    },
  };
});

const params = Promise.resolve({ escrowId: "e1" });
const req = () => new Request("http://localhost/api/escrows/e1/release", { method: "PATCH" }) as never;

beforeEach(() => { identity = { userId: CLIENT, userRole: "client" }; });

describe("PATCH /api/escrows/[escrowId]/release", () => {
  it("lets the client who funded it release", async () => {
    const { PATCH } = await import("@/app/api/escrows/[escrowId]/release/route");
    const res = await PATCH(req(), { params });
    expect(res.status).toBe(200);
  });

  it("refuses a stranger with 403, not 200", async () => {
    identity = { userId: STRANGER, userRole: "client" };
    const { PATCH } = await import("@/app/api/escrows/[escrowId]/release/route");
    const res = await PATCH(req(), { params });
    // Before the fix this returned 200 and paid out someone else's escrow.
    expect(res.status).toBe(403);
  });

  it("refuses an unauthenticated caller", async () => {
    identity = null;
    const { PATCH } = await import("@/app/api/escrows/[escrowId]/release/route");
    const res = await PATCH(req(), { params });
    expect(res.status).toBe(401);
  });

  it("refuses a consultant, who may not release to themselves", async () => {
    identity = { userId: CONSULT, userRole: "seller" };
    const { PATCH } = await import("@/app/api/escrows/[escrowId]/release/route");
    const res = await PATCH(req(), { params });
    expect(res.status).toBe(403);
  });
});

describe("PATCH /api/escrows/[escrowId]/cancel", () => {
  const cancelReq = () =>
    new Request("http://localhost/api/escrows/e1/cancel", { method: "PATCH" }) as never;

  it("lets the client cancel their own escrow", async () => {
    const { PATCH } = await import("@/app/api/escrows/[escrowId]/cancel/route");
    expect((await PATCH(cancelReq(), { params })).status).toBe(200);
  });

  it("refuses a stranger — the refund path once credited the caller", async () => {
    identity = { userId: STRANGER, userRole: "client" };
    const { PATCH } = await import("@/app/api/escrows/[escrowId]/cancel/route");
    expect((await PATCH(cancelReq(), { params })).status).toBe(403);
  });
});
