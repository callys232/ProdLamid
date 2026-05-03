
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

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const search = searchParams.get("search") ?? undefined;

    const all = await getConsultants({ industry, minRate, maxRate, minRating });

    const filtered = search
      ? all.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.role?.toLowerCase().includes(search.toLowerCase()))
      : all;

    const total = filtered.length;
    const paged = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paged,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
