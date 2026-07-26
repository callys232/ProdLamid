"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q05Page() {
  const config = MODULE_REGISTRY["Q05"] ?? buildFallbackConfig("Q05", "Q-Series — Decision Intelligence", "Decision Timing Diagnostic");
  return (
    <DashboardTierGate pillar="Decision Timing Diagnostic" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
