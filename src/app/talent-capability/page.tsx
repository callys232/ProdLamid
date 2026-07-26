"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function TalentCapabilityPage() {
  const config = MODULE_REGISTRY["A02"] ?? buildFallbackConfig("A02", "LAMID TALENT — Workforce Intelligence", "Capability Intelligence Engine");
  return (
    <DashboardTierGate pillar="A02 — Capability Intelligence Engine" backHref="/talent-dashboard" backLabel="TALENT Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
