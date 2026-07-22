"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z12Page() {
  const config = MODULE_REGISTRY["Z12"] ?? buildFallbackConfig("Z12", "Z-Series — Transformation Intelligence", "Enterprise Renewal Cycle Engine");
  return (
    <DashboardTierGate pillar="Z12 — Enterprise Renewal Cycle Engine" backHref="/z11-cosmic-flow" backLabel="Enterprise Flow Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
