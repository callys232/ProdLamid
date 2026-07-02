"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X01Page() {
  const config = MODULE_REGISTRY["X01"] ?? buildFallbackConfig("X01", "X-Series — Protection Intelligence", "Risk Intelligence Engine");
  return (
    <DashboardTierGate pillar="X01 — Risk Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
