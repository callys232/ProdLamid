"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z09Page() {
  const config = MODULE_REGISTRY["Z09"] ?? buildFallbackConfig("Z09", "Z-Series — Transformation Intelligence", "Enterprise Consistency Check Engine");
  return (
    <DashboardTierGate pillar="Z09 — Enterprise Consistency Check Engine" backHref="/z08-enterprise-wide-intelligence-summary" backLabel="Enterprise-Wide Intelligence Summary">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
