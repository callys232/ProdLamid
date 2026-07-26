"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q38Page() {
  const config = MODULE_REGISTRY["Q38"] ?? buildFallbackConfig("Q38", "Q-Series — Decision Intelligence", "Enterprise Decision System Engine");
  return (
    <DashboardTierGate pillar="Enterprise Decision System Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
