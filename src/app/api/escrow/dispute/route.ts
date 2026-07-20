import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import { Escrow } from "@/lib/models/Escrow";
import cloudinary from "@/lib/cloudinary";
import { emailDisputeOpened } from "@/lib/services/transactionalEmailService";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const contentType = request.headers.get("content-type") ?? "";
    let escrowId = "", reason = "", evidenceUrls: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form  = await request.formData();
      escrowId    = String(form.get("escrowId") ?? "");
      reason      = String(form.get("reason")   ?? "");
      const files = form.getAll("evidence") as File[];
      for (const file of files.slice(0, 5)) {
        if (file.size > 10 * 1024 * 1024) continue;
        const buf = Buffer.from(await file.arrayBuffer());
        const result: any = await new Promise((resolve, reject) =>
          cloudinary.uploader.upload_stream(
            { folder: `lamid/disputes/${escrowId}`, resource_type: "auto" },
            (err, res) => err ? reject(err) : resolve(res)
          ).end(buf)
        );
        evidenceUrls.push(result.secure_url);
      }
    } else {
      const body = await request.json();
      escrowId = body.escrowId;
      reason   = body.reason;
    }

    if (!escrowId) return NextResponse.json({ success: false, message: "escrowId required" }, { status: 400 });
    if (!reason?.trim()) return NextResponse.json({ success: false, message: "Reason required" }, { status: 400 });

    const escrow = await Escrow.findByIdAndUpdate(
      escrowId,
      { $set: { status: "disputed", disputeReason: reason.trim(), disputeEvidence: evidenceUrls, disputedBy: auth.userId, disputedAt: new Date() } },
      { new: true }
    ).lean() as any;

    if (!escrow) return NextResponse.json({ success: false, message: "Escrow not found" }, { status: 404 });

    if (escrow.consultantId && escrow.clientId) {
      emailDisputeOpened({
        clientId: String(escrow.clientId), consultantId: String(escrow.consultantId),
        projectTitle: `Escrow #${escrowId}`, reason: reason.trim(),
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, message: "Dispute filed. Our team will review within 24 hours.", evidenceCount: evidenceUrls.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
