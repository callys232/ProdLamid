
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
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
        const user = await Users.findById(decoded.userId).select("-password").populate("profile");
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const userData = user.toJSON();
        return NextResponse.json({ success: true, data: userData });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Unauthorized: " + error.message },
            { status: 401 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        await connectDB();

        // Get token
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

        const body = await request.json();

        // Update Profile
        // We allow updating any field in the Profile model
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: user._id },
            { $set: body },
            { new: true, upsert: true }
        );

        // Update User (e.g. for twoFAEnabled)
        if (body.twoFAEnabled !== undefined) {
            await Users.findByIdAndUpdate(user._id, { twoFAEnabled: body.twoFAEnabled });
        }

        // Return updated user with profile
        const updatedUser = await Users.findById(user._id).select("-password").populate("profile");
        const userData = updatedUser.toJSON();

        return NextResponse.json({ success: true, data: userData });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
