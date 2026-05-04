import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

export interface AuthResult {
    userId: string;
    userRole: string;
    orgId?: string;
    orgRole?: string;
}

export interface AuthenticatedRequest extends NextRequest {
    userId?: string;
    userRole?: string;
    orgId?: string;
    orgRole?: string;
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

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId?: string; sub?: string;
            role?: string;
            orgId?: string;
            orgRole?: string;
        };

        const userId = decoded.userId || decoded.sub;
        if (!userId) return null;

        return {
            userId,
            userRole: decoded.role ?? "client",
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

/**
 * Check if user has specific role
 */
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole);
}
