import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { buildContractHtml } from "@/lib/pdf/contractTemplate";

// POST /api/contract/generate — generates a printable HTML contract
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const required = ["projectTitle", "projectScope", "deliverables", "startDate", "totalAmount", "paymentTerms", "client", "consultant"];
    for (const k of required) {
      if (!body[k]) return NextResponse.json({ success: false, message: `${k} is required` }, { status: 400 });
    }

    const html = buildContractHtml({
      contractNumber: `CSA-${Date.now()}`,
      date:           new Date().toISOString().split("T")[0],
      ...body,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type":        "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="contract-${body.projectTitle.replace(/\s+/g, "-")}.html"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
