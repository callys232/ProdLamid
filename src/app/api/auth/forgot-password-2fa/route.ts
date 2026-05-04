import { NextRequest, NextResponse } from "next/server";
// Delegates to the same email-based reset flow.
// A future 2FA implementation can replace this body.
export { POST } from "@/app/api/auth/forgot-password/route";
