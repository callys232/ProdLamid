"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A13Page() {
  const config = MODULE_REGISTRY["A13"] ?? buildFallbackConfig("A13", "A-Series — TALENT Intelligence", "Talent Experience Intelligence Engine");
  return (
    <DashboardTierGate pillar="Talent Experience Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
