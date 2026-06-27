import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { Wallet } from "@/lib/models/Wallet";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* -------- PREVENT BUILD EXECUTION -------- */

export const dynamic = "force-dynamic";

/* -------- ENV -------- */

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

/* -------- DELETE ACCOUNT -------- */

export async function DELETE(request: NextRequest) {
    try {
        /* -------- CONNECT DATABASE -------- */

        await connectDB();

        /* -------- GET TOKEN FROM COOKIE -------- */

        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("token");
        let token = tokenCookie?.value;

        /* -------- FALLBACK: AUTH HEADER -------- */

        if (!token) {
            const authHeader = request.headers.get("Authorization");

            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        /* -------- AUTH VALIDATION -------- */

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        /* -------- VERIFY TOKEN -------- */

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const userId = decoded.userId;

        /* -------- DELETE USER DATA -------- */

        await Users.findByIdAndDelete(userId);
        await Profile.findOneAndDelete({ user: userId });
        await Wallet.findOneAndDelete({ user: userId });

        /* -------- CLEAR COOKIE -------- */

        const response = NextResponse.json({
            success: true,
            message: "Account deleted successfully",
        });

        response.cookies.set("token", "", {
            expires: new Date(0),
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Delete account error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete account",
            },
            { status: 500 }
        );
    }
}