"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z15Page() {
  const config = MODULE_REGISTRY["Z15"] ?? buildFallbackConfig("Z15", "Z-Series — Transformation Intelligence", "Organizational Insight Tracker Engine");
  return (
    <DashboardTierGate pillar="Organizational Insight Tracker Engine" backHref="/z14-organizational-insight-consistency" backLabel="Organizational Insight Consistency">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
