"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function TalentWorkforcePlanningPage() {
  const config = MODULE_REGISTRY["A03"] ?? buildFallbackConfig("A03", "LAMID TALENT — Workforce Intelligence", "Workforce Planning Engine");
  return (
    <DashboardTierGate pillar="Workforce Planning Engine" backHref="/talent-capability" backLabel="Capability Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
