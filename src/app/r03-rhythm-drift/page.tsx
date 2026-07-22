"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R03Page() {
  const config = MODULE_REGISTRY["R03"] ?? buildFallbackConfig("R03", "R-Series — Cadence Intelligence", "Cadence Drift Alert Engine");
  return (
    <DashboardTierGate pillar="R03 — Cadence Drift Alert Engine" backHref="/r02-rhythm-velocity" backLabel="Pace of Execution">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
