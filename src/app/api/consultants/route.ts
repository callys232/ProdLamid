
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getConsultants } from "@/lib/services/consultantService";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const industry = searchParams.get("industry") || undefined;
        const minRate = searchParams.get("minRate") ? parseFloat(searchParams.get("minRate")!) : undefined;
        const maxRate = searchParams.get("maxRate") ? parseFloat(searchParams.get("maxRate")!) : undefined;
        const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;

        const consultants = await getConsultants({
            industry,
            minRate,
            maxRate,
            minRating
        });

        return NextResponse.json({ success: true, data: consultants });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
