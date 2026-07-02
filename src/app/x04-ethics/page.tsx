"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X04Page() {
  const config = MODULE_REGISTRY["X04"] ?? buildFallbackConfig("X04", "X-Series — Protection Intelligence", "Ethics Intelligence Engine");
  return (
    <DashboardTierGate pillar="X04 — Ethics Intelligence Engine" backHref="/x03-governance" backLabel="Governance Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
