"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q53Page() {
  const config = MODULE_REGISTRY["Q53"] ?? buildFallbackConfig("Q53", "Q-Series — Decision Intelligence", "Team Capacity & Workload Monitor Engine");
  return (
    <DashboardTierGate pillar="Q53 — Team Capacity & Workload Monitor Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
