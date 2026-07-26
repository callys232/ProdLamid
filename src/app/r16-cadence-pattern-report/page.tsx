"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R16Page() {
  const config = MODULE_REGISTRY["R16"] ?? buildFallbackConfig("R16", "R-Series — Cadence Intelligence", "Cadence Pattern Report Engine");
  return (
    <DashboardTierGate pillar="Cadence Pattern Report Engine" backHref="/r15-organisational-cadence-profile" backLabel="Organisational Cadence Profile">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
