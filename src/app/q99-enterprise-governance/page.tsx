"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q99Page() {
  const config = MODULE_REGISTRY["Q99"] ?? buildFallbackConfig("Q99", "Q-Series — Decision Intelligence", "Enterprise Governance Engine");
  return (
    <DashboardTierGate pillar="Enterprise Governance Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
