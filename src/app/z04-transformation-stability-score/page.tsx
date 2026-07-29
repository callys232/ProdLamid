"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z04Page() {
  const config = MODULE_REGISTRY["Z04"] ?? buildFallbackConfig("Z04", "Z-Series — Transformation Intelligence", "Transformation Stability Score Engine");
  return (
    <DashboardTierGate pillar="Transformation Stability Score" backHref="/z03-transformation-drift-alert" backLabel="Transformation Drift Alert">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
