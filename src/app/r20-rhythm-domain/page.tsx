"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R20Page() {
  const config = MODULE_REGISTRY["R20"] ?? buildFallbackConfig("R20", "R-Series — Cadence Intelligence", "Department Cadence View Engine");
  return (
    <DashboardTierGate pillar="R20 — Department Cadence View Engine" backHref="/r19-rhythm-field" backLabel="Cadence Impact Area">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
