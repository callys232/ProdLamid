"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q71Page() {
  const config = MODULE_REGISTRY["Q71"] ?? buildFallbackConfig("Q71", "Q-Series — Decision Intelligence", "Decision Timeline Engine");
  return (
    <DashboardTierGate pillar="Q71 — Decision Timeline Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
