"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P25Page() {
  const config = MODULE_REGISTRY["P25"] ?? buildFallbackConfig("P25", "P-Series — Enterprise Productivity", "Innovation Productivity Engine");
  return (
    <DashboardTierGate pillar="Innovation Productivity Engine" backHref="/p24-technology-productivity" backLabel="Technology Productivity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
