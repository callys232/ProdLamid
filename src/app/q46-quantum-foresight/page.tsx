"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q46Page() {
  const config = MODULE_REGISTRY["Q46"] ?? buildFallbackConfig("Q46", "Q-Series — Decision Intelligence", "Predictive Foresight Engine");
  return (
    <DashboardTierGate pillar="Q46 — Predictive Foresight Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
