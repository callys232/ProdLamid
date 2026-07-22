"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S04Page() {
  const config = MODULE_REGISTRY["S04"]!;
  return (
    <DashboardTierGate pillar="S04 — Cross-Function Strategy Alignment Engine" backHref="/s03-strategic-coherence" backLabel="Back to Strategy Consistency Check">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
