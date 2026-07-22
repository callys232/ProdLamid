"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R21Page() {
  const config = MODULE_REGISTRY["R21"] ?? buildFallbackConfig("R21", "R-Series — Cadence Intelligence", "Business Unit Cadence View Engine");
  return (
    <DashboardTierGate pillar="R21 — Business Unit Cadence View Engine" backHref="/r20-rhythm-domain" backLabel="Department Cadence View">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
