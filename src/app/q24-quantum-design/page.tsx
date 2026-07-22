"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q24Page() {
  const config = MODULE_REGISTRY["Q24"] ?? buildFallbackConfig("Q24", "Q-Series — Decision Intelligence", "Decision Model Designer Engine");
  return (
    <DashboardTierGate pillar="Q24 — Decision Model Designer Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
