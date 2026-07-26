"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R10Page() {
  const config = MODULE_REGISTRY["R10"] ?? buildFallbackConfig("R10", "R-Series — Cadence Intelligence", "Multi-Team Cadence Sync Engine");
  return (
    <DashboardTierGate pillar="R10 — Multi-Team Cadence Sync Engine" backHref="/r09-rhythm-alignment" backLabel="Strategy-to-Execution Alignment">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
