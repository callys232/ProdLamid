"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q09Page() {
  const config = MODULE_REGISTRY["Q09"] ?? buildFallbackConfig("Q09", "Q-Series — Decision Intelligence", "Option Selection Assistant Engine");
  return (
    <DashboardTierGate pillar="Option Selection Assistant" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
