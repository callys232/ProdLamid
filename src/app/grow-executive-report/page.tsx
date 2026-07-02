"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowExecutiveReportPage() {
  const config = MODULE_REGISTRY["G09"] ?? buildFallbackConfig("G09", "LAMID GROW — Growth Intelligence", "Executive Growth Report Engine");
  return (
    <DashboardTierGate pillar="G09 — Executive Growth Report Engine" backHref="/grow-advisory-console" backLabel="Advisory Console">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
