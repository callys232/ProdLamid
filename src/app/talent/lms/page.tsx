import { redirect } from "next/navigation";

// Force runtime evaluation so LMS_URL env var is read per-request, not baked at build time.
export const dynamic = "force-dynamic";

// Redirects to the external LMS platform.
// Set LMS_URL env variable to override the default.
export default function LmsRedirectPage() {
  redirect(process.env.LMS_URL || "https://learn-by-lamid.vercel.app/");
}
