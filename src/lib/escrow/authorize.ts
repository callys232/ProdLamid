/**
 * Escrow access control.
 *
 * An escrow is reachable by four kinds of caller and nobody else:
 *
 *   client          — funded it
 *   consultant      — is owed from it
 *   pm              — the dedicated project manager assigned to a party's account
 *   account-owner   — owns the organisation a party belongs to
 *
 * Administrators are outside this list and act through /api/admin/escrow, where
 * every action carries a reason and is recorded on the escrow.
 *
 * No other client, freelancer, organisation or tier may read or act on it. This
 * exists because the routes authenticated the caller and then never checked
 * whether that caller had anything to do with the escrow they named.
 *
 * The first two are decided synchronously from the escrow document. The last two
 * need a lookup, so they live in `resolveEscrowAccess` / `assertEscrowAccess`.
 */

export interface EscrowParties {
  clientId?:     unknown;
  consultantId?: unknown;
  /** Legacy field on older rows; treated as the client. */
  userId?:       unknown;
}

/** Normalises an ObjectId, populated document, or string to a plain id. */
function idOf(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const v = value as { _id?: unknown; toString?: () => string };
    if (v._id) return String(v._id);
    if (typeof v.toString === "function") {
      const s = v.toString();
      return s === "[object Object]" ? null : s;
    }
  }
  return null;
}

export type EscrowRole = "client" | "consultant" | "admin" | null;

/** Which side of this escrow the user sits on, or null if neither. */
export function escrowRoleOf(
  escrow: EscrowParties,
  userId: string,
  userRole?: string,
): EscrowRole {
  if (userRole === "admin") return "admin";
  if (!userId) return null;

  const client     = idOf(escrow.clientId) ?? idOf(escrow.userId);
  const consultant = idOf(escrow.consultantId);

  if (client && client === userId) return "client";
  if (consultant && consultant === userId) return "consultant";
  return null;
}

/** True when the caller is a party to this escrow (or an administrator). */
export function isEscrowParty(
  escrow: EscrowParties,
  userId: string,
  userRole?: string,
): boolean {
  return escrowRoleOf(escrow, userId, userRole) !== null;
}

/**
 * A Mongo filter restricting any escrow query to the caller's own records.
 * Use on list endpoints so a caller can never enumerate other people's escrows.
 */
export function escrowScopeFilter(userId: string, userRole?: string) {
  if (userRole === "admin") return {};
  return { $or: [{ clientId: userId }, { consultantId: userId }, { userId }] };
}

/**
 * Thrown by controllers so the route layer can map it to a 403 rather than
 * leaking it as a generic 400.
 */
export class EscrowAccessError extends Error {
  readonly status = 403;
  constructor(message = "You do not have access to this escrow.") {
    super(message);
    this.name = "EscrowAccessError";
  }
}

/** Throws unless the caller is a party to the escrow. */
export function assertEscrowParty(
  escrow: EscrowParties,
  userId: string,
  userRole?: string,
): void {
  if (!isEscrowParty(escrow, userId, userRole)) throw new EscrowAccessError();
}

/* ── Delegated access ──────────────────────────────────────────────────────
   Beyond the two direct parties, two roles legitimately need sight of an
   escrow: the dedicated project manager assigned to a party's account, and the
   owner of the organisation that party belongs to. Both require a database
   lookup, so they live in the async guard below rather than the pure one. */

export type ExtendedEscrowRole = EscrowRole | "pm" | "account-owner";

/** Minimal shape the async guard needs; kept loose to avoid a model import. */
interface UserLookup {
  findById(id: string): { select(f: string): { lean(): Promise<any> } };
  findOne(filter: Record<string, unknown>): { select(f: string): { lean(): Promise<any> } };
}
interface OrgLookup {
  findById(id: string): { select(f: string): { lean(): Promise<any> } };
  findOne(filter: Record<string, unknown>): { select(f: string): { lean(): Promise<any> } };
}

/**
 * Full access decision, including delegated roles.
 *
 * Returns which capacity the caller acts in, or null when they have none.
 * Direct parties and admins short-circuit without touching the database.
 */
export async function resolveEscrowAccess(
  escrow: EscrowParties,
  userId: string,
  userRole: string | undefined,
  models: { Users: UserLookup; Organization?: OrgLookup },
): Promise<ExtendedEscrowRole | null> {
  const direct = escrowRoleOf(escrow, userId, userRole);
  if (direct) return direct;
  if (!userId) return null;

  const partyIds = [
    idOf(escrow.clientId) ?? idOf(escrow.userId),
    idOf(escrow.consultantId),
  ].filter(Boolean) as string[];
  if (partyIds.length === 0) return null;

  const parties = await Promise.all(
    partyIds.map((id) => models.Users.findById(id).select("assignedPmId orgId").lean()),
  );

  // Dedicated PM for either side of the escrow.
  if (parties.some((p) => p && idOf(p.assignedPmId) === userId)) return "pm";

  // Owner of the organisation a party belongs to.
  if (models.Organization) {
    const orgIds = [...new Set(parties.map((p) => p && idOf(p.orgId)).filter(Boolean) as string[])];
    for (const orgId of orgIds) {
      const org = await models.Organization.findById(orgId).select("ownerId").lean();
      if (org && idOf(org.ownerId) === userId) return "account-owner";
    }
  }

  return null;
}

/**
 * Every user id the caller may see escrows for: themselves, the accounts they
 * manage as dedicated PM, and — if they own an organisation — its members.
 *
 * Used to widen list queries. Returns an empty array for an administrator,
 * whose queries are unscoped anyway.
 */
export async function visibleEscrowUserIds(
  userId: string,
  userRole: string | undefined,
  models: {
    Users: UserLookup & { find(f: Record<string, unknown>, p?: unknown): { lean(): Promise<any[]> } };
    Organization?: OrgLookup;
  },
): Promise<string[]> {
  if (!userId || userRole === "admin") return [];

  const ids = new Set<string>([userId]);

  // Accounts this user is the dedicated PM for.
  const managed = await models.Users.find({ assignedPmId: userId }, { _id: 1 }).lean();
  for (const m of managed ?? []) ids.add(String(m._id));

  // Organisations this user owns — every member is in scope.
  if (models.Organization) {
    const owned = await models.Organization.findOne({ ownerId: userId }).select("_id").lean();
    if (owned?._id) {
      const members = await models.Users.find({ orgId: owned._id }, { _id: 1 }).lean();
      for (const m of members ?? []) ids.add(String(m._id));
    }
  }

  return [...ids];
}

/** Async counterpart to assertEscrowParty, including PM and account owner. */
export async function assertEscrowAccess(
  escrow: EscrowParties,
  userId: string,
  userRole: string | undefined,
  models: { Users: UserLookup; Organization?: OrgLookup },
): Promise<ExtendedEscrowRole> {
  const role = await resolveEscrowAccess(escrow, userId, userRole, models);
  if (!role) throw new EscrowAccessError();
  return role;
}
