"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R07Page() {
  const config = MODULE_REGISTRY["R07"] ?? buildFallbackConfig("R07", "R-Series — Cadence Intelligence", "Cadence Consistency Check Engine");
  return (
    <DashboardTierGate pillar="R07 — Cadence Consistency Check Engine" backHref="/r06-rhythm-harmony" backLabel="Cross-Team Cadence Fit">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
