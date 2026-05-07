// ⚠️ DEV ONLY — remove before production
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Users } from "@/lib/models/User";
import { Organization } from "@/lib/models/Organization";
import { OrgMember, DEFAULT_PERMISSIONS } from "@/lib/models/OrgMember";
import bcrypt from "bcryptjs";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not available in production." }, { status: 403 });
  }
  try {
    await dbConnect();

    const email    = "enterprise@lamid.test";
    const password = "Enterprise@123";

    // Always delete and recreate for a clean state
    const existing = await Users.findOne({ email });
    if (existing) {
      await Organization.deleteOne({ ownerId: existing._id });
      await Users.deleteOne({ _id: existing._id });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await Users.create({
      email,
      password: hash,
      username: "enterprise_test",
      role: "client",
      isVerified: true,
      status: "active",
      accountType: "Enterprise",
    });

    const org = await Organization.create({
      name: "Test Enterprise Corp",
      slug: `test-enterprise-corp-${Date.now()}`,
      tier: "enterprise",
      maxMembers: 50,
      ownerId: user._id,
      status: "active",
    });

    await OrgMember.create({
      orgId: org._id,
      userId: user._id,
      role: "org_admin",
      status: "active",
      joinedAt: new Date(),
      permissions: DEFAULT_PERMISSIONS["org_admin"],
    });

    await Users.findByIdAndUpdate(user._id, {
      orgId:       org._id,
      orgRole:     "org_admin",
      accountType: "Enterprise",
    });

    return NextResponse.json({
      message:   "✅ Enterprise test user created.",
      email,
      password,
      dashboard: "/enterprise",
      orgName:   org.name,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
