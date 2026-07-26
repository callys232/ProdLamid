"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R18Page() {
  const config = MODULE_REGISTRY["R18"] ?? buildFallbackConfig("R18", "R-Series — Cadence Intelligence", "Cultural Cadence Fit Engine");
  return (
    <DashboardTierGate pillar="R18 — Cultural Cadence Fit Engine" backHref="/r17-rhythm-essence" backLabel="Core Cadence Drivers">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
