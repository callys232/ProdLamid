
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rateLimit } from "@/lib/rateLimit";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const rl = await rateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, max: 10 });
        if (!rl.allowed) {
            return NextResponse.json(
                { success: false, message: "Too many login attempts. Try again in 15 minutes." },
                { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
            );
        }

        await connectDB();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Missing email or password" },
                { status: 400 }
            );
        }

        // Find User
        const user = await Users.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Reject deleted or suspended accounts before checking password
        if ((user as any).isDeleted || (user as any).status === "deleted") {
            return NextResponse.json(
                { success: false, message: "This account has been removed. Contact support if this is an error." },
                { status: 403 }
            );
        }
        if ((user as any).status === "suspended") {
            return NextResponse.json(
                { success: false, message: "Your account is suspended. Contact support to appeal." },
                { status: 403 }
            );
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Include orgId/orgRole in token if enterprise user
        const tokenPayload: Record<string, unknown> = { userId: user._id, role: user.role };
        if ((user as any).orgId)   tokenPayload.orgId   = String((user as any).orgId);
        if ((user as any).orgRole) tokenPayload.orgRole = (user as any).orgRole;

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

        // Sanitise user object — never send password to client
        const safeUser = { ...((user as any).toObject?.() ?? user) };
        delete safeUser.password;
        delete safeUser.verificationCode;
        delete safeUser.resetToken;
        delete safeUser.twoFASecret;

        const response = NextResponse.json(
            { success: true, data: { user: safeUser, token } },
            { status: 200 }
        );

        // HttpOnly token cookie (secure, not readable by JS)
        response.cookies.set("token", token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:   7 * 24 * 60 * 60,
            path:     "/",
        });

        // Readable role cookie (non-httpOnly) so client UI can show correct nav without an extra API call
        response.cookies.set("user_role", (user as any).role ?? "client", {
            httpOnly: false,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:   7 * 24 * 60 * 60,
            path:     "/",
        });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
