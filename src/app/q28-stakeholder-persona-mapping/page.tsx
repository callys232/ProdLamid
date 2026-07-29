"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q28Page() {
  const config = MODULE_REGISTRY["Q28"] ?? buildFallbackConfig("Q28", "Q-Series — Decision Intelligence", "Stakeholder Persona Mapping Engine");
  return (
    <DashboardTierGate pillar="Stakeholder Persona Mapping" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
