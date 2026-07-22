"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q14Page() {
  const config = MODULE_REGISTRY["Q14"] ?? buildFallbackConfig("Q14", "Q-Series — Decision Intelligence", "Data Source Validator Engine");
  return (
    <DashboardTierGate pillar="Q14 — Data Source Validator Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
