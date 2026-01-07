import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

export interface AuthenticatedRequest extends NextRequest {
    userId?: string;
    userRole?: string;
}

/**
 * Middleware to verify JWT token from cookies or Authorization header
 * Returns userId and userRole if valid, null if invalid
 */
export async function verifyAuth(request: NextRequest): Promise<{ userId: string; userRole: string } | null> {
    try {
        // Try to get token from cookie first
        let token = request.cookies.get("token")?.value;

        // If not in cookie, try Authorization header
        if (!token) {
            const authHeader = request.headers.get("authorization");
            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return null;
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

        return {
            userId: decoded.userId,
            userRole: decoded.role
        };
    } catch (error) {
        return null;
    }
}

/**
 * Middleware wrapper that requires authentication
 * Returns 401 if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<{ userId: string; userRole: string } | NextResponse> {
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
