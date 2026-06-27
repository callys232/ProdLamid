import { Suspense } from "react";
import EnterpriseDashboard from "@/components/enterprise/EnterpriseDashboard";

export const dynamic = "force-dynamic";

export default function EnterprisePage() {
  return (
    <Suspense>
      <EnterpriseDashboard />
    </Suspense>
  );
}
