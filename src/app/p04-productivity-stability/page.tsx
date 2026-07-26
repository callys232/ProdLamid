"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P04Page() {
  const config = MODULE_REGISTRY["P04"] ?? buildFallbackConfig("P04", "P-Series — Enterprise Productivity", "Productivity Stability Engine");
  return (
    <DashboardTierGate pillar="P04 — Productivity Stability Engine" backHref="/p03-productivity-drift" backLabel="Productivity Drift">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
