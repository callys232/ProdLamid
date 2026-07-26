"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q09Page() {
  const config = MODULE_REGISTRY["Q09"] ?? buildFallbackConfig("Q09", "Q-Series — Decision Intelligence", "Option Selection Assistant Engine");
  return (
    <DashboardTierGate pillar="Q09 — Option Selection Assistant Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
