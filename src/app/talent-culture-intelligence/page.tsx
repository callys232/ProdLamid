"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function TalentCultureIntelligencePage() {
  const config = MODULE_REGISTRY["A05"] ?? buildFallbackConfig("A05", "LAMID TALENT — Workforce Intelligence", "Culture Intelligence Engine");
  return (
    <DashboardTierGate pillar="A05 — Culture Intelligence Engine" backHref="/talent-leadership-pipeline" backLabel="Leadership Pipeline">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
