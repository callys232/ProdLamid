import { redirect } from "next/navigation";

// /subscription redirects to the full pricing page
export default function SubscriptionPage() {
  redirect("/pricing");
}
