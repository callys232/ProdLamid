import { Suspense } from "react";
import ConciergeDashboard from "@/components/concierge/ConciergeDashboard";

export const metadata = {
  title: "Concierge Portal | Lamid Consulting",
  description: "White-glove consulting service for government agencies, UN bodies, NGOs and large corporations.",
};

export default function ConciergePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ConciergeDashboard />
    </Suspense>
  );
}
