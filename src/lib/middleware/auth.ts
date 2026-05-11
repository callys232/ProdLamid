import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isRevoked } from "@/lib/tokenBlocklist";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");

export interface AuthResult {
    userId:   string;
    userRole: string;
    token:    string;   // raw token (needed for revocation on logout)
    exp:      number;   // expiry seconds (needed for blocklist TTL)
    orgId?:   string;
    orgRole?: string;
}

export interface AuthenticatedRequest extends NextRequest {
    userId?:   string;
    userRole?: string;
    orgId?:    string;
    orgRole?:  string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult | null> {
    try {
        let token = request.cookies.get("token")?.value;

        if (!token) {
            const authHeader = request.headers.get("authorization");
            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (!token) return null;

        // Check blocklist before verifying signature (fast path for logged-out tokens)
        if (await isRevoked(token)) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId?: string;
            sub?:    string;
            role?:   string;
            orgId?:  string;
            orgRole?: string;
            exp?:    number;
        };

        const userId = decoded.userId || decoded.sub;
        if (!userId) return null;

        return {
            userId,
            userRole: decoded.role ?? "client",
            token,
            exp:      decoded.exp ?? Math.floor(Date.now() / 1000) + 7 * 86400,
            ...(decoded.orgId   && { orgId:   decoded.orgId }),
            ...(decoded.orgRole && { orgRole: decoded.orgRole }),
        };
    } catch {
        return null;
    }
}

export async function requireAuth(request: NextRequest): Promise<AuthResult | NextResponse> {
    const auth = await verifyAuth(request);

    if (!auth) {
        return NextResponse.json(
            { success: false, message: "Unauthorized. Please login." },
            { status: 401 }
        );
    }

    return auth;
}

export function hasRole(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole);
}
