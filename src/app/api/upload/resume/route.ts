
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Profile } from "@/lib/models/Profile";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import cloudinary from "@/lib/cloudinary";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

export async function POST(request: Request) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("token");
        let token = tokenCookie?.value;

        if (!token) {
            const authHeader = request.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        // Convert file to Buffer for Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResponse: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "resumes",
                    public_id: `resume_${userId}_${Date.now()}`,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // Update Profile
        await Profile.findOneAndUpdate(
            { user: userId },
            { $set: { resumeUrl: uploadResponse.secure_url } },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "Resume uploaded successfully",
            url: uploadResponse.secure_url,
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
