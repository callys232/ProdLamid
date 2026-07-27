import { describe, it, expect } from "vitest";
import {
  escrowRoleOf, isEscrowParty, resolveEscrowAccess, visibleEscrowUserIds,
} from "@/lib/escrow/authorize";

const CLIENT = "aaaaaaaaaaaaaaaaaaaaaaa1";
const CONSULT = "aaaaaaaaaaaaaaaaaaaaaaa2";
const PM = "aaaaaaaaaaaaaaaaaaaaaaa3";
const OWNER = "aaaaaaaaaaaaaaaaaaaaaaa4";
const STRANGER = "aaaaaaaaaaaaaaaaaaaaaaa9";
const ORG = "org1";

const escrow = { clientId: CLIENT, consultantId: CONSULT };

/** Stubs matching only the two lookup methods the guard uses. */
const models = {
  Users: {
    findById: (id: string) => ({
      select: () => ({
        lean: async () => (id === CLIENT ? { assignedPmId: PM, orgId: ORG } : { assignedPmId: null, orgId: null }),
      }),
    }),
    findOne: () => ({ select: () => ({ lean: async () => null }) }),
    find: () => ({ lean: async () => [] }),
  },
  Organization: {
    findById: () => ({ select: () => ({ lean: async () => ({ ownerId: OWNER }) }) }),
    // visibleEscrowUserIds looks the org up by owner rather than by id.
    findOne: () => ({ select: () => ({ lean: async () => null }) }),
  },
} as any;

describe("escrow access", () => {
  it("admits the client and the consultant", () => {
    expect(escrowRoleOf(escrow, CLIENT)).toBe("client");
    expect(escrowRoleOf(escrow, CONSULT)).toBe("consultant");
  });

  it("refuses everyone else", () => {
    expect(escrowRoleOf(escrow, STRANGER)).toBeNull();
    expect(isEscrowParty(escrow, STRANGER)).toBe(false);
  });

  it("admits an administrator without a party match", () => {
    expect(escrowRoleOf(escrow, STRANGER, "admin")).toBe("admin");
  });

  it("treats the legacy userId field as the client", () => {
    expect(escrowRoleOf({ userId: CLIENT }, CLIENT)).toBe("client");
  });

  it("resolves a populated document, not just an id string", () => {
    expect(escrowRoleOf({ clientId: { _id: CLIENT } }, CLIENT)).toBe("client");
  });

  it("admits the dedicated PM of a party", async () => {
    expect(await resolveEscrowAccess(escrow, PM, undefined, models)).toBe("pm");
  });

  it("admits the owner of a party's organisation", async () => {
    expect(await resolveEscrowAccess(escrow, OWNER, undefined, models)).toBe("account-owner");
  });

  it("still refuses an unrelated user after the delegated checks", async () => {
    expect(await resolveEscrowAccess(escrow, STRANGER, undefined, models)).toBeNull();
  });

  it("returns no scope widening for an administrator", async () => {
    expect(await visibleEscrowUserIds(CLIENT, "admin", models)).toEqual([]);
  });

  it("always includes the caller in their own visible set", async () => {
    expect(await visibleEscrowUserIds(CLIENT, "client", models)).toContain(CLIENT);
  });
});
