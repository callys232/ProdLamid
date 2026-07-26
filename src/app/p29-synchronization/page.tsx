"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P29Page() {
  const config = MODULE_REGISTRY["P29"] ?? buildFallbackConfig("P29", "P-Series — Enterprise Productivity", "Synchronization Engine");
  return (
    <DashboardTierGate pillar="P29 — Synchronization Engine" backHref="/p28-convergence" backLabel="Convergence Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
