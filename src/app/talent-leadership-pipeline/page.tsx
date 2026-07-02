"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function TalentLeadershipPipelinePage() {
  const config = MODULE_REGISTRY["A04"] ?? buildFallbackConfig("A04", "LAMID TALENT — Workforce Intelligence", "Leadership Pipeline Engine");
  return (
    <DashboardTierGate pillar="A04 — Leadership Pipeline Engine" backHref="/talent-workforce-planning" backLabel="Workforce Planning">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
