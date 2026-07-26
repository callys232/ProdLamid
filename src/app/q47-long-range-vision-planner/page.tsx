"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q47Page() {
  const config = MODULE_REGISTRY["Q47"] ?? buildFallbackConfig("Q47", "Q-Series — Decision Intelligence", "Long-Range Vision Planner Engine");
  return (
    <DashboardTierGate pillar="Q47 — Long-Range Vision Planner Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
