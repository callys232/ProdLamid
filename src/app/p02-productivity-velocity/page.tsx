"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P02Page() {
  const config = MODULE_REGISTRY["P02"] ?? buildFallbackConfig("P02", "P-Series — Enterprise Productivity", "Productivity Velocity Engine");
  return (
    <DashboardTierGate pillar="P02 — Productivity Velocity Engine" backHref="/p01-productivity-mapping" backLabel="Productivity Mapping">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
