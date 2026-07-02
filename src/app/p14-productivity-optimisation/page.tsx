"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P14Page() {
  const config = MODULE_REGISTRY["P14"] ?? buildFallbackConfig("P14", "P-Series — Enterprise Productivity", "Productivity Optimisation Engine");
  return (
    <DashboardTierGate pillar="P14 — Productivity Optimisation Engine" backHref="/p13-productivity-execution" backLabel="Productivity Execution">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
