"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A32Page() {
  const config = MODULE_REGISTRY["A32"] ?? buildFallbackConfig("A32", "A-Series — TALENT Intelligence", "ETOS — Enterprise Talent Operating System");
  return (
    <DashboardTierGate pillar="A32 — ETOS — Enterprise Talent Operating System" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
