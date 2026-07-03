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

    const email    = "freelancer@lamid.test";
    const password = "Freelancer@123";
    const hash     = await bcrypt.hash(password, 10);

    await Users.deleteOne({ email });

    await Users.create({
      email,
      password:    hash,
      username:    "freelancer_test",
      role:        "seller",
      isVerified:  true,
      status:      "active",
      accountType: "Freelancer",
    });

    return NextResponse.json({
      message:   "✅ Freelancer/Consultant test user created.",
      email,
      password,
      dashboard: "/profile",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
