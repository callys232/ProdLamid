"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S05Page() {
  const config = MODULE_REGISTRY["S05"]!;
  return (
    <DashboardTierGate pillar="S05 — Strategic Execution Cadence Engine" backHref="/s04-strategic-convergence" backLabel="Back to Cross-Function Strategy Alignment">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
