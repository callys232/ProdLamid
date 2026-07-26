"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S09Page() {
  const config = MODULE_REGISTRY["S09"]!;
  return (
    <DashboardTierGate pillar="S09 — Strategic Priority Weighting Engine" backHref="/s08-strategic-force" backLabel="Back to Strategic Momentum Score">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
