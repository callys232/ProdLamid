"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q18Page() {
  const config = MODULE_REGISTRY["Q18"] ?? buildFallbackConfig("Q18", "Q-Series — Decision Intelligence", "Cross-Team Consistency Check Engine");
  return (
    <DashboardTierGate pillar="Cross-Team Consistency Check Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
