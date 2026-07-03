"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A28Page() {
  const config = MODULE_REGISTRY["A28"] ?? buildFallbackConfig("A28", "A-Series — TALENT Intelligence", "Executive Talent Intelligence Engine");
  return (
    <DashboardTierGate pillar="A28 — Executive Talent Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
