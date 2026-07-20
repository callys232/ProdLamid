import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { denyEngineUsers } from "@/lib/middleware/engineGuard";
import cloudinary from "@/lib/cloudinary";

// POST /api/escrow/upload — upload files for a project escrow
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const engineBlock = denyEngineUsers(auth);
    if (engineBlock) return engineBlock;

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 }
      );
    }

    const MAX_SIZE_MB = 10;
    const ALLOWED_TYPES = [
      "image/jpeg", "image/png", "image/webp", "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const uploaded: { name: string; url: string; publicId: string; size: number }[] = [];

    for (const file of files) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: `File "${file.name}" exceeds ${MAX_SIZE_MB}MB limit` },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: `File type "${file.type}" is not allowed` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `lamid/escrow/${auth.userId}`,
            resource_type: "auto",
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      uploaded.push({
        name: file.name,
        url: result.secure_url,
        publicId: result.public_id,
        size: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${uploaded.length} file(s) uploaded successfully`,
      data: uploaded,
    });
  } catch (error: any) {
    console.error("Escrow upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
