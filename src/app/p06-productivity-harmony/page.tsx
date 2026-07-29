"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P06Page() {
  const config = MODULE_REGISTRY["P06"] ?? buildFallbackConfig("P06", "P-Series — Enterprise Productivity", "Productivity Harmony Engine");
  return (
    <DashboardTierGate pillar="Productivity Harmony" backHref="/p05-productivity-balance" backLabel="Productivity Balance">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
