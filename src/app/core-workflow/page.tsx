"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function CoreWorkflowPage() {
  const config = MODULE_REGISTRY["C02"] ?? buildFallbackConfig("C02", "LAMID CORE — Consulting Intelligence", "Workflow Engine");
  return (
    <DashboardTierGate pillar="Workflow" backHref="/core-dashboard" backLabel="CORE Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
