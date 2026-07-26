"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R23Page() {
  const config = MODULE_REGISTRY["R23"] ?? buildFallbackConfig("R23", "R-Series — Cadence Intelligence", "Long-Term Cadence Trends Engine");
  return (
    <DashboardTierGate pillar="R23 — Long-Term Cadence Trends Engine" backHref="/r22-rhythm-universe" backLabel="Enterprise-Wide Cadence View">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
