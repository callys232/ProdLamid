"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q58Page() {
  const config = MODULE_REGISTRY["Q58"] ?? buildFallbackConfig("Q58", "Q-Series — Decision Intelligence", "Impact Magnitude Report Engine");
  return (
    <DashboardTierGate pillar="Impact Magnitude Report" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
