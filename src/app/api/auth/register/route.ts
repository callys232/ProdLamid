
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User"; // Check import name - file looked like "User.ts" but model might be "Users" or "User"
import { Profile } from "@/lib/models/Profile";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 400 }
            );
        }

        // Validate role
        if (!["client", "seller"].includes(role)) {
            return NextResponse.json(
                { success: false, message: "Invalid role. Must be 'client' or 'seller'." },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await Users.create({
            username: name.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000), // Simple username gen
            email,
            password: hashedPassword,
            role, // "client" or "seller"
            isVerified: true, // Auto-verify for simplicity
        });

        // Create empty Profile for the user
        await Profile.create({
            user: user._id,
            firstName: name.split(" ")[0],
            lastName: name.split(" ").slice(1).join(" ") || "",
            // Initialize consultant fields if seller?
            ...(role === "seller" && {
                title: "New Consultant",
                rate: 50,
                rating: 0,
                industry: "General",
                delivery: "Remote",
                skills: []
            })
        });

        // Generate Token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return success
        const response = NextResponse.json(
            { success: true, data: { user, token } },
            { status: 201 }
        );

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
