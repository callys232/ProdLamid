"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q60Page() {
  const config = MODULE_REGISTRY["Q60"] ?? buildFallbackConfig("Q60", "Q-Series — Decision Intelligence", "Decision Urgency Index Engine");
  return (
    <DashboardTierGate pillar="Decision Urgency Index Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
