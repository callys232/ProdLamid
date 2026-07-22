"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R22Page() {
  const config = MODULE_REGISTRY["R22"] ?? buildFallbackConfig("R22", "R-Series — Cadence Intelligence", "Enterprise-Wide Cadence View Engine");
  return (
    <DashboardTierGate pillar="R22 — Enterprise-Wide Cadence View Engine" backHref="/r21-rhythm-realm" backLabel="Business Unit Cadence View">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
