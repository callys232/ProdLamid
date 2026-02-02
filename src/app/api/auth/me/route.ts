
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

export async function GET(request: Request) {
    try {
        await connectDB();

        // Get token from cookie or header
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("token");
        let token = tokenCookie?.value;

        if (!token) {
            const authHeader = request.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify token
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        // Find User
        const user = await Users.findById(decoded.userId).select("-password").populate("profile"); // Populate profile info
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Unauthorized: " + error.message },
            { status: 401 }
        );
    }
}
