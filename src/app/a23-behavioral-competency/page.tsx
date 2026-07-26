"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A23Page() {
  const config = MODULE_REGISTRY["A23"] ?? buildFallbackConfig("A23", "A-Series — TALENT Intelligence", "Behavioral Competency Engine");
  return (
    <DashboardTierGate pillar="Behavioral Competency Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
