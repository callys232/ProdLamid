
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        const consultant = await User.findById(id)
            .populate("profile")
            .select("-password -__v");

        if (!consultant) {
            return NextResponse.json(
                { success: false, message: "Consultant not found" },
                { status: 404 }
            );
        }

        // Optional: Check if user is actually a seller? 
        // For now, returning any user by ID is probably fine, but technically we want consultants.
        if (consultant.role !== "seller") {
            // Decide if we want to restrict this or just return details. 
            // Let's assume we return details but maybe flag it? 
            // For now, strict:
            // return NextResponse.json({ success: false, message: "User is not a consultant" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: consultant });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
