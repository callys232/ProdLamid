import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        // TODO: Send email or save to database
        // For now, just return success
        console.log("Contact form submission:", { name, email, subject, message });

        return NextResponse.json({
            success: true,
            message: "Thank you for contacting us. We'll get back to you soon!"
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
