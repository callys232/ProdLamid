"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z11Page() {
  const config = MODULE_REGISTRY["Z11"] ?? buildFallbackConfig("Z11", "Z-Series — Transformation Intelligence", "Enterprise Flow Tracker Engine");
  return (
    <DashboardTierGate pillar="Enterprise Flow Tracker Engine" backHref="/z10-enterprise-wide-alignment" backLabel="Enterprise-Wide Alignment">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
