import { NextRequest, NextResponse } from "next/server";
// Falls back to email reset until SMS provider is configured.
export { POST } from "@/app/api/auth/forgot-password/route";
