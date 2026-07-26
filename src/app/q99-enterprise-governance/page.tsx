"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q99Page() {
  const config = MODULE_REGISTRY["Q99"] ?? buildFallbackConfig("Q99", "Q-Series — Decision Intelligence", "Enterprise Governance Engine");
  return (
    <DashboardTierGate pillar="Q99 — Enterprise Governance Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
