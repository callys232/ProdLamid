"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P20Page() {
  const config = MODULE_REGISTRY["P20"] ?? buildFallbackConfig("P20", "P-Series — Enterprise Productivity", "Capability Engine");
  return (
    <DashboardTierGate pillar="P20 — Capability Engine" backHref="/p19-engagement-engine" backLabel="Engagement Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
