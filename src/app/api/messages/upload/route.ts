import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

// POST /api/messages/upload — upload attachment, return secure URL
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const form    = await req.formData();
    const file    = form.get("file") as File | null;
    const projectId = form.get("projectId") as string | null;

    if (!file)      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ success: false, message: "File must be under 20MB" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const result: any = await new Promise((resolve, reject) =>
      cloudinary.uploader.upload_stream(
        {
          folder:        `lamid/messages/${projectId ?? "general"}`,
          resource_type: "auto",
          public_id:     `msg_${Date.now()}`,
        },
        (err, res) => err ? reject(err) : resolve(res)
      ).end(buffer)
    );

    return NextResponse.json({
      success:    true,
      url:        result.secure_url,
      type:       result.resource_type,
      filename:   file.name,
      size:       result.bytes,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
