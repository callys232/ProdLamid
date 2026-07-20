import { NextResponse } from "next/server";
import { AuthResult } from "./auth";

/**
 * Returns a 403 response if the user is an Engine-only account.
 * Engine users can access CORE, GROW, and TALENT engines but cannot
 * engage with tier services (escrow, marketplace, hiring, etc.).
 * Call this right after requireAuth in any gated route.
 */
export function denyEngineUsers(auth: AuthResult): NextResponse | null {
  if (auth.accountType === "Engine") {
    return NextResponse.json(
      {
        success: false,
        message: "Upgrade to a membership plan to access this feature.",
        code:    "ENGINE_ONLY",
      },
      { status: 403 }
    );
  }
  return null;
}
