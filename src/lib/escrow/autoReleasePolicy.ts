/**
 * When escrowed funds may move without the client saying yes.
 *
 * There are only two routes to release:
 *
 *   1. The client approves the milestone — funds move immediately.
 *   2. Nobody approves and nobody disputes for a long time — funds move on the
 *      timer, so a consultant is not left unpaid by a client who has gone quiet.
 *
 * The second is a fallback for silence, not a default settlement path. It ran at
 * twelve hours, which is a single night: a client who did not read their email
 * before morning had already lost the chance to object. Seven days is long
 * enough that silence is a fair signal.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Days of unbroken silence before certified work releases on its own. */
export const AUTO_RELEASE_DAYS = (() => {
  const raw = Number(process.env.ESCROW_AUTO_RELEASE_DAYS);
  // Floor of 2 days so it can be tuned but never reduced back to overnight.
  return Number.isFinite(raw) && raw >= 2 ? raw : 7;
})();

export const AUTO_RELEASE_MS = AUTO_RELEASE_DAYS * DAY_MS;

/** The moment certified work becomes eligible, measured from certification. */
export function autoReleaseDeadline(from: Date = new Date()): Date {
  return new Date(from.getTime() + AUTO_RELEASE_MS);
}

/** Human phrasing for notifications, so the copy tracks the setting. */
export function autoReleaseWindowLabel(): string {
  return AUTO_RELEASE_DAYS === 1 ? "24 hours" : `${AUTO_RELEASE_DAYS} days`;
}

/**
 * Milestone states that must never auto-release.
 *
 * A dispute stops the clock outright. `approved` and `released` are already
 * settled, and re-releasing them would double-pay.
 */
export const BLOCKS_AUTO_RELEASE = ["dispute", "approved", "released", "ai_rejected", "stopped"] as const;
