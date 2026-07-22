"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S10Page() {
  const config = MODULE_REGISTRY["S10"]!;
  return (
    <DashboardTierGate pillar="S10 — Strategic Focus Areas Engine" backHref="/s09-strategic-gravity" backLabel="Back to Strategic Priority Weighting">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
