"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function CoreExecutiveConsolePage() {
  const config = MODULE_REGISTRY["C09"] ?? buildFallbackConfig("C09", "LAMID CORE — Consulting Intelligence", "Executive Consulting Console");
  return (
    <DashboardTierGate pillar="C09 — Executive Consulting Console" backHref="/core-change-management" backLabel="Change Management Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
