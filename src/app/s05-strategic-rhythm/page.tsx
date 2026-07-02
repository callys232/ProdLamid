"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S05Page() {
  const config = MODULE_REGISTRY["S05"]!;
  return (
    <DashboardTierGate pillar="S05 — Strategic Rhythm Engine" backHref="/s04-strategic-convergence" backLabel="Back to Strategic Convergence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
