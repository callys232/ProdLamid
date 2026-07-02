"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P07Page() {
  const config = MODULE_REGISTRY["P07"] ?? buildFallbackConfig("P07", "P-Series — Enterprise Productivity", "Productivity Coherence Engine");
  return (
    <DashboardTierGate pillar="P07 — Productivity Coherence Engine" backHref="/p06-productivity-harmony" backLabel="Productivity Harmony">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
