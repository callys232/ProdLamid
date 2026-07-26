"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R30Page() {
  const config = MODULE_REGISTRY["R30"] ?? buildFallbackConfig("R30", "R-Series — Cadence Intelligence", "Enterprise Cadence Overview Engine");
  return (
    <DashboardTierGate pillar="R30 — Enterprise Cadence Overview Engine" backHref="/r29-rhythm-crown" backLabel="Executive Cadence Report">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
