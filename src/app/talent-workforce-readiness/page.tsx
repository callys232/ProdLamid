"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function TalentWorkforceReadinessPage() {
  const config = MODULE_REGISTRY["A06"] ?? buildFallbackConfig("A06", "LAMID TALENT — Workforce Intelligence", "Workforce Readiness Engine");
  return (
    <DashboardTierGate pillar="Workforce Readiness Engine" backHref="/talent-culture-intelligence" backLabel="Culture Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
