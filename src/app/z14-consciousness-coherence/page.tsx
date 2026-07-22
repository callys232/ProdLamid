"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z14Page() {
  const config = MODULE_REGISTRY["Z14"] ?? buildFallbackConfig("Z14", "Z-Series — Transformation Intelligence", "Organizational Insight Consistency Engine");
  return (
    <DashboardTierGate pillar="Z14 — Organizational Insight Consistency Engine" backHref="/z13-enterprise-consciousness" backLabel="Enterprise Insight Index">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
