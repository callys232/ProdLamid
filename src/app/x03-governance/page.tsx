"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X03Page() {
  const config = MODULE_REGISTRY["X03"] ?? buildFallbackConfig("X03", "X-Series — Protection Intelligence", "Governance Intelligence Engine");
  return (
    <DashboardTierGate pillar="Governance Intelligence Engine" backHref="/x02-compliance" backLabel="Compliance Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
