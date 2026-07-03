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

    const email    = "client@lamid.test";
    const password = "Client@123";
    const hash     = await bcrypt.hash(password, 10);

    await Users.deleteOne({ email });

    await Users.create({
      email,
      password:    hash,
      username:    "client_test",
      role:        "client",
      isVerified:  true,
      status:      "active",
      accountType: "Client",
    });

    return NextResponse.json({
      message:   "✅ Client test user created.",
      email,
      password,
      dashboard: "/client",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
