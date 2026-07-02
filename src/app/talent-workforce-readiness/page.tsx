"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function TalentWorkforceReadinessPage() {
  const config = MODULE_REGISTRY["A06"] ?? buildFallbackConfig("A06", "LAMID TALENT — Workforce Intelligence", "Workforce Readiness Engine");
  return (
    <DashboardTierGate pillar="A06 — Workforce Readiness Engine" backHref="/talent-culture-intelligence" backLabel="Culture Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
