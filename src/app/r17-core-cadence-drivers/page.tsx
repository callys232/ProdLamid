"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R17Page() {
  const config = MODULE_REGISTRY["R17"] ?? buildFallbackConfig("R17", "R-Series — Cadence Intelligence", "Core Cadence Drivers Engine");
  return (
    <DashboardTierGate pillar="R17 — Core Cadence Drivers Engine" backHref="/r16-rhythm-identity" backLabel="Cadence Pattern Report">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
