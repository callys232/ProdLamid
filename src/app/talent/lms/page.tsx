import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { SsoCode } from "@/lib/models/SsoCode";
import { getJwtSecret } from "@/lib/jwt";
import { LMS_URL } from "@/lib/externalPlatforms";

export const dynamic = "force-dynamic";

export default async function LmsRedirectPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/signin?next=/talent/lms");

  let userId: string;
  let accountType: string;

  try {
    const decoded: any = jwt.verify(token, getJwtSecret());
    userId      = String(decoded.userId);
    accountType = String(decoded.accountType ?? "Engine");
  } catch {
    redirect("/signin?next=/talent/lms");
  }

  // Fetch minimal user info for the SSO payload
  await connectDB();
  const [user, profile] = await Promise.all([
    Users.findById(userId).select("email username").lean() as any,
    Profile.findOne({ user: userId }).select("firstName lastName").lean() as any,
  ]);

  if (!user) redirect("/signin?next=/talent/lms");

  const email = user.email ?? "";
  const name  = profile?.firstName
    ? `${profile.firstName} ${profile.lastName ?? ""}`.trim()
    : user.username ?? "";

  // Create a one-time SSO code — expires in 5 minutes via MongoDB TTL index
  const code = randomUUID();
  await SsoCode.create({ code, userId, email, name, accountType });

  const base = LMS_URL;
  const dest  = new URL(base);
  dest.searchParams.set("sso", code);

  redirect(dest.toString());
}
