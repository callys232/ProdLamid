"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q61Page() {
  const config = MODULE_REGISTRY["Q61"] ?? buildFallbackConfig("Q61", "Q-Series — Decision Intelligence", "Decision Scope Mapper Engine");
  return (
    <DashboardTierGate pillar="Decision Scope Mapper Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
