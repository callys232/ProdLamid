"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function CoreStrategicAlignmentPage() {
  const config = MODULE_REGISTRY["C07"] ?? buildFallbackConfig("C07", "LAMID CORE — Consulting Intelligence", "Strategic Alignment Engine");
  return (
    <DashboardTierGate pillar="Strategic Alignment Engine" backHref="/core-blueprint" backLabel="Blueprint Generator">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
