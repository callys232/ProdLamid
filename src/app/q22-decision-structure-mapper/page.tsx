"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q22Page() {
  const config = MODULE_REGISTRY["Q22"] ?? buildFallbackConfig("Q22", "Q-Series — Decision Intelligence", "Decision Structure Mapper Engine");
  return (
    <DashboardTierGate pillar="Q22 — Decision Structure Mapper Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
