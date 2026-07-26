"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowDigitalMaturityPage() {
  const config = MODULE_REGISTRY["G06"] ?? buildFallbackConfig("G06", "LAMID GROW — Growth Intelligence", "Digital Maturity Model Engine");
  return (
    <DashboardTierGate pillar="Digital Maturity Model Engine" backHref="/grow-market-intelligence" backLabel="Market Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
