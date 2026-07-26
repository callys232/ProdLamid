"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function TalentLeadershipPipelinePage() {
  const config = MODULE_REGISTRY["A04"] ?? buildFallbackConfig("A04", "LAMID TALENT — Workforce Intelligence", "Leadership Pipeline Engine");
  return (
    <DashboardTierGate pillar="Leadership Pipeline Engine" backHref="/talent-workforce-planning" backLabel="Workforce Planning">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
