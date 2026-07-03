"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X02Page() {
  const config = MODULE_REGISTRY["X02"] ?? buildFallbackConfig("X02", "X-Series — Protection Intelligence", "Security Intelligence Engine");
  return (
    <DashboardTierGate pillar="X02 — Security Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
