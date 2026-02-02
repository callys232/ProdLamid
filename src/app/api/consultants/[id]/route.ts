import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getConsultantById } from "@/lib/services/consultantService";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        const consultant = await getConsultantById(id);

        if (!consultant) {
            return NextResponse.json(
                { success: false, message: "Consultant not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: consultant });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
