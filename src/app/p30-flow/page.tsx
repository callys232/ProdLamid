"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P30Page() {
  const config = MODULE_REGISTRY["P30"] ?? buildFallbackConfig("P30", "P-Series — Enterprise Productivity", "Flow Engine");
  return (
    <DashboardTierGate pillar="P30 — Flow Engine" backHref="/p29-synchronization" backLabel="Synchronization Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
