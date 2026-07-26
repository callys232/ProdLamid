"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q88Page() {
  const config = MODULE_REGISTRY["Q88"] ?? buildFallbackConfig("Q88", "Q-Series — Decision Intelligence", "Enterprise Decision Insight Engine");
  return (
    <DashboardTierGate pillar="Q88 — Enterprise Decision Insight Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
