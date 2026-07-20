import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { buildInvoiceHtml, InvoiceData } from "@/lib/pdf/invoiceTemplate";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";

// POST /api/invoice/generate — returns HTML invoice (printable/saveable as PDF via browser print)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const body = await req.json();
    const { toUserId, items, notes, currency = "$" } = body;

    if (!items?.length) return NextResponse.json({ success: false, message: "Items required" }, { status: 400 });

    const [fromUser, fromProfile, toUser, toProfile] = await Promise.all([
      Users.findById(auth.userId).select("email username").lean() as any,
      Profile.findOne({ user: auth.userId }).select("firstName lastName").lean() as any,
      toUserId ? Users.findById(toUserId).select("email username").lean() as any : null,
      toUserId ? Profile.findOne({ user: toUserId }).select("firstName lastName").lean() as any : null,
    ]);

    const fromName = fromProfile?.firstName
      ? `${fromProfile.firstName} ${fromProfile.lastName ?? ""}`.trim()
      : fromUser?.username ?? "Consultant";

    const toName = toProfile?.firstName
      ? `${toProfile.firstName} ${toProfile.lastName ?? ""}`.trim()
      : toUser?.username ?? body.toName ?? "Client";

    const invoiceData: InvoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date:          new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      currency,
      from:  { name: fromName, email: fromUser?.email ?? "" },
      to:    { name: toName,   email: toUser?.email   ?? body.toEmail ?? "" },
      items,
      notes,
    };

    const html = buildInvoiceHtml(invoiceData);

    return new NextResponse(html, {
      headers: {
        "Content-Type":        "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="invoice-${invoiceData.invoiceNumber}.html"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
