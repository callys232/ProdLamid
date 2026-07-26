"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P01Page() {
  const config = MODULE_REGISTRY["P01"] ?? buildFallbackConfig("P01", "P-Series — Enterprise Productivity", "Productivity Mapping Engine");
  return (
    <DashboardTierGate pillar="P01 — Productivity Mapping Engine" backHref="/operations-intelligence" backLabel="Operations Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
