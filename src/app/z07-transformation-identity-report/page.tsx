"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z07Page() {
  const config = MODULE_REGISTRY["Z07"] ?? buildFallbackConfig("Z07", "Z-Series — Transformation Intelligence", "Transformation Identity Report Engine");
  return (
    <DashboardTierGate pillar="Transformation Identity Report" backHref="/z06-transformation-progress-tracker" backLabel="Transformation Progress Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
