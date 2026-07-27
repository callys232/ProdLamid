import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/**
 * Routes that must refuse the public.
 *
 * /api/ledger shipped with no authentication at all and, with no projectId,
 * returned every escrow transaction on the platform. These lock both the
 * authentication and the admin role in place.
 */

let identity: { userId: string; userRole: string } | null = null;

vi.mock("@/lib/db", () => ({ default: async () => undefined }));

vi.mock("@/lib/middleware/auth", async () => {
  const { NextResponse } = await import("next/server");
  return {
    requireAuth: async () =>
      identity ?? NextResponse.json({ error: "Unauthorised" }, { status: 401 }),
    verifyAuth: async () => identity,
  };
});

// No project belongs to the caller, so a scoped query must come back empty.
vi.mock("@/lib/models/Project", () => ({
  Project: { find: () => ({ lean: async () => [] }) },
}));
vi.mock("@/lib/models/EscrowTransaction", () => ({
  EscrowTransaction: {
    find: () => ({ sort: () => ({ lean: async () => [{ _id: "t1", amount: 999, projectId: "p-other" }] }) }),
  },
}));
vi.mock("@/lib/models/User", () => ({ Users: { find: () => ({ lean: async () => [] }) } }));
vi.mock("@/lib/models/Organization", () => ({
  Organization: { findOne: () => ({ select: () => ({ lean: async () => null }) }) },
}));
vi.mock("@/lib/models/Escrow", () => ({
  Escrow: {
    find: () => ({ sort: () => ({ limit: () => ({ populate: () => ({ populate: () => ({ lean: async () => [] }) }) }) }) }),
    aggregate: async () => [],
  },
}));

const ledgerReq = () => new NextRequest("http://localhost/api/ledger") as never;

beforeEach(() => { identity = null; });

describe("GET /api/ledger", () => {
  it("refuses an unauthenticated caller", async () => {
    const { GET } = await import("@/app/api/ledger/route");
    // This route was once fully public and returned the whole ledger.
    expect((await GET(ledgerReq())).status).toBe(401);
  });

  it("returns nothing to a signed-in user with no projects", async () => {
    identity = { userId: "u-nobody", userRole: "client" };
    const { GET } = await import("@/app/api/ledger/route");
    const res = await GET(ledgerReq());
    expect(res.status).toBe(200);
    // Another party's transaction must not appear just because it exists.
    expect((await res.json()).data).toEqual([]);
  });
});

describe("GET /api/admin/escrow", () => {
  const req = () => new NextRequest("http://localhost/api/admin/escrow?status=disputed") as never;

  it("refuses an unauthenticated caller", async () => {
    const { GET } = await import("@/app/api/admin/escrow/route");
    expect((await GET(req())).status).toBe(401);
  });

  it("refuses a signed-in non-admin", async () => {
    identity = { userId: "u1", userRole: "client" };
    const { GET } = await import("@/app/api/admin/escrow/route");
    expect((await GET(req())).status).toBe(403);
  });

  it("admits an administrator", async () => {
    identity = { userId: "admin1", userRole: "admin" };
    const { GET } = await import("@/app/api/admin/escrow/route");
    expect((await GET(req())).status).toBe(200);
  });
});

describe("PATCH /api/admin/escrow", () => {
  const body = (b: unknown) =>
    new NextRequest("http://localhost/api/admin/escrow", {
      method: "PATCH", body: JSON.stringify(b), headers: { "Content-Type": "application/json" },
    }) as never;

  it("refuses a non-admin", async () => {
    identity = { userId: "u1", userRole: "client" };
    const { PATCH } = await import("@/app/api/admin/escrow/route");
    expect((await PATCH(body({ escrowId: "x", action: "release", reason: "r" }))).status).toBe(403);
  });

  it("requires a reason from an administrator", async () => {
    identity = { userId: "admin1", userRole: "admin" };
    const { PATCH } = await import("@/app/api/admin/escrow/route");
    // An override with no stated reason is not auditable.
    const res = await PATCH(body({ escrowId: "507f1f77bcf86cd799439011", action: "release" }));
    expect(res.status).toBe(400);
  });
});
