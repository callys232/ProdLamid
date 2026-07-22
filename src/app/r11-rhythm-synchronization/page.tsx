"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R11Page() {
  const config = MODULE_REGISTRY["R11"] ?? buildFallbackConfig("R11", "R-Series — Cadence Intelligence", "Real-Time Cadence Sync Engine");
  return (
    <DashboardTierGate pillar="R11 — Real-Time Cadence Sync Engine" backHref="/r10-rhythm-convergence" backLabel="Multi-Team Cadence Sync">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
