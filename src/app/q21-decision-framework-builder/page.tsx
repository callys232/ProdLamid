"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q21Page() {
  const config = MODULE_REGISTRY["Q21"] ?? buildFallbackConfig("Q21", "Q-Series — Decision Intelligence", "Decision Framework Builder Engine");
  return (
    <DashboardTierGate pillar="Decision Framework Builder Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
