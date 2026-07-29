"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P19Page() {
  const config = MODULE_REGISTRY["P19"] ?? buildFallbackConfig("P19", "P-Series — Enterprise Productivity", "Engagement Engine");
  return (
    <DashboardTierGate pillar="Engagement" backHref="/p18-communication-engine" backLabel="Communication Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
