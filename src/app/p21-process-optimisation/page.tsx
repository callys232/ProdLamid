"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P21Page() {
  const config = MODULE_REGISTRY["P21"] ?? buildFallbackConfig("P21", "P-Series — Enterprise Productivity", "Process Optimisation Engine");
  return (
    <DashboardTierGate pillar="P21 — Process Optimisation Engine" backHref="/p20-capability-engine" backLabel="Capability Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
