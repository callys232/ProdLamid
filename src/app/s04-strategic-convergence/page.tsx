"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S04Page() {
  const config = MODULE_REGISTRY["S04"]!;
  return (
    <DashboardTierGate pillar="S04 — Strategic Convergence Engine" backHref="/s03-strategic-coherence" backLabel="Back to Strategic Coherence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
