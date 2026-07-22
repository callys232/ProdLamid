"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z01Page() {
  const config = MODULE_REGISTRY["Z01"] ?? buildFallbackConfig("Z01", "Z-Series — Transformation Intelligence", "Breakthrough Opportunity Mapping Engine");
  return (
    <DashboardTierGate pillar="Z01 — Breakthrough Opportunity Mapping Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
