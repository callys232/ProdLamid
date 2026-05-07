// ⚠️ DEV ONLY — remove before production
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Users } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not available in production." }, { status: 403 });
  }

  try {
    await dbConnect();

    const email    = "concierge@lamid.test";
    const password = "Concierge@123";
    const hash     = await bcrypt.hash(password, 10);

    // Delete any existing user with this email to ensure a clean document
    await Users.deleteOne({ email });

    await Users.create({
      email,
      password: hash,
      username: "concierge_test",
      role: "client",
      isVerified: true,
      status: "active",
      accountType: "Concierge",
      conciergeRequest: {
        status: "approved",
        organisation: "Test Government Agency",
        orgType: "Government Agency",
        description: "Test concierge account for dashboard review.",
        submittedAt: new Date(),
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "✅ Concierge test user created.",
      email,
      password,
      dashboard: "/concierge",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
