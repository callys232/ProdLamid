"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S04Page() {
  const config = MODULE_REGISTRY["S04"]!;
  return (
    <DashboardTierGate pillar="Cross-Function Strategy Alignment" backHref="/s03-strategic-coherence" backLabel="Back to Strategy Consistency Check">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
