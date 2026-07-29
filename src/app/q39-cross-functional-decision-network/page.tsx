"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q39Page() {
  const config = MODULE_REGISTRY["Q39"] ?? buildFallbackConfig("Q39", "Q-Series — Decision Intelligence", "Cross-Functional Decision Network Engine");
  return (
    <DashboardTierGate pillar="Cross-Functional Decision Network" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
