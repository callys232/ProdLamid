
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile"; // Ensure Profile model is imported to register schema

export async function GET() {
    try {
        await connectDB();

        // Find users with role "seller" (consultants)
        // Populate the 'profile' virtual
        const consultants = await User.find({ role: "seller" })
            .populate("profile")
            .select("-password -__v"); // Exclude sensitive fields

        return NextResponse.json({ success: true, data: consultants });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
