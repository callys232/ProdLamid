"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P11Page() {
  const config = MODULE_REGISTRY["P11"] ?? buildFallbackConfig("P11", "P-Series — Enterprise Productivity", "Productivity Excellence Engine");
  return (
    <DashboardTierGate pillar="P11 — Productivity Excellence Engine" backHref="/p10-productivity-performance" backLabel="Productivity Performance">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
