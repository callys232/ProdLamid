"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P03Page() {
  const config = MODULE_REGISTRY["P03"] ?? buildFallbackConfig("P03", "P-Series — Enterprise Productivity", "Productivity Drift Engine");
  return (
    <DashboardTierGate pillar="P03 — Productivity Drift Engine" backHref="/p02-productivity-velocity" backLabel="Productivity Velocity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
