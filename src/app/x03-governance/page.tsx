"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X03Page() {
  const config = MODULE_REGISTRY["X03"] ?? buildFallbackConfig("X03", "X-Series — Protection Intelligence", "Governance Intelligence Engine");
  return (
    <DashboardTierGate pillar="X03 — Governance Intelligence Engine" backHref="/x02-compliance" backLabel="Compliance Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
