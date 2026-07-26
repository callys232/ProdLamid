"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A10Page() {
  const config = MODULE_REGISTRY["A10"] ?? buildFallbackConfig("A10", "A-Series — TALENT Intelligence", "Talent Performance Intelligence Engine");
  return (
    <DashboardTierGate pillar="Talent Performance Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
