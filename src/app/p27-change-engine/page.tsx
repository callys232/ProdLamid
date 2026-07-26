"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P27Page() {
  const config = MODULE_REGISTRY["P27"] ?? buildFallbackConfig("P27", "P-Series — Enterprise Productivity", "Change Management Engine");
  return (
    <DashboardTierGate pillar="P27 — Change Management Engine" backHref="/p26-transformation-engine" backLabel="Transformation Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
