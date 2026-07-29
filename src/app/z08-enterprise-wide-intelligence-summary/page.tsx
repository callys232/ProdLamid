"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z08Page() {
  const config = MODULE_REGISTRY["Z08"] ?? buildFallbackConfig("Z08", "Z-Series — Transformation Intelligence", "Enterprise-Wide Intelligence Summary Engine");
  return (
    <DashboardTierGate pillar="Enterprise-Wide Intelligence Summary" backHref="/z07-transformation-identity-report" backLabel="Transformation Identity Report">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
