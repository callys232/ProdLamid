"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S10Page() {
  const config = MODULE_REGISTRY["S10"]!;
  return (
    <DashboardTierGate pillar="S10 — Strategic Focus Areas Engine" backHref="/s09-strategic-priority-weighting" backLabel="Back to Strategic Priority Weighting">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
