
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcryptjs from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

export async function POST(request: Request) {
    try {
        await connectDB();

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
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await Users.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const { oldPassword, newPassword } = await request.json();

        // Verify old password
        if (user.password) {
            const isMatch = await bcryptjs.compare(oldPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ success: false, message: "Incorrect old password" }, { status: 400 });
            }
        }

        // Hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ success: true, message: "Password updated successfully" });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
