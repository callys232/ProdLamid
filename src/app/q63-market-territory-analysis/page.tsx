"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q63Page() {
  const config = MODULE_REGISTRY["Q63"] ?? buildFallbackConfig("Q63", "Q-Series — Decision Intelligence", "Market Territory Analysis Engine");
  return (
    <DashboardTierGate pillar="Market Territory Analysis Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
