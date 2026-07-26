"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P05Page() {
  const config = MODULE_REGISTRY["P05"] ?? buildFallbackConfig("P05", "P-Series — Enterprise Productivity", "Productivity Balance Engine");
  return (
    <DashboardTierGate pillar="P05 — Productivity Balance Engine" backHref="/p04-productivity-stability" backLabel="Productivity Stability">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
