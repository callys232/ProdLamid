"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P24Page() {
  const config = MODULE_REGISTRY["P24"] ?? buildFallbackConfig("P24", "P-Series — Enterprise Productivity", "Technology Productivity Engine");
  return (
    <DashboardTierGate pillar="P24 — Technology Productivity Engine" backHref="/p23-systems-productivity" backLabel="Systems Productivity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
