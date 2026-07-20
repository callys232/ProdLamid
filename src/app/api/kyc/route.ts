import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import cloudinary from "@/lib/cloudinary";
import { Users } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) return NextResponse.json({ success: false, message: "No files provided" }, { status: 400 });
    if (files.length > 5) return NextResponse.json({ success: false, message: "Maximum 5 files allowed" }, { status: 400 });

    const uploaded: string[] = [];

    for (const file of files) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type))
        return NextResponse.json({ success: false, message: `File type ${file.type} not allowed` }, { status: 400 });

      if (file.size > 10 * 1024 * 1024)
        return NextResponse.json({ success: false, message: "Each file must be under 10MB" }, { status: 400 });

      const buffer = Buffer.from(await file.arrayBuffer());

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder:          `lamid/kyc/${auth.userId}`,
            resource_type:   "auto",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
            public_id:       `kyc_${Date.now()}`,
          },
          (err, res) => (err ? reject(err) : resolve(res))
        ).end(buffer);
      });

      uploaded.push(result.secure_url);
    }

    // Store URLs on user record (add kycDocuments field or use profile)
    await Users.findByIdAndUpdate(auth.userId, {
      $set:  { kycStatus: "pending" },
      $push: { kycDocuments: { $each: uploaded } },
    });

    return NextResponse.json({
      success: true,
      message: "KYC documents submitted. We'll review within 1-2 business days.",
      urls: uploaded,
    });
  } catch (e: any) {
    console.error("KYC upload error:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const user = await Users.findById(auth.userId).select("kycStatus kycDocuments").lean() as any;
    return NextResponse.json({ success: true, data: { status: user?.kycStatus ?? "not_submitted", documents: user?.kycDocuments ?? [] } });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
