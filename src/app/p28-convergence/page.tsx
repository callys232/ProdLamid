"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P28Page() {
  const config = MODULE_REGISTRY["P28"] ?? buildFallbackConfig("P28", "P-Series — Enterprise Productivity", "Convergence Engine");
  return (
    <DashboardTierGate pillar="P28 — Convergence Engine" backHref="/p27-change-engine" backLabel="Change Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
