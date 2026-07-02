"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P13Page() {
  const config = MODULE_REGISTRY["P13"] ?? buildFallbackConfig("P13", "P-Series — Enterprise Productivity", "Productivity Execution Engine");
  return (
    <DashboardTierGate pillar="P13 — Productivity Execution Engine" backHref="/p12-productivity-delivery" backLabel="Productivity Delivery">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
