"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A09Page() {
  const config = MODULE_REGISTRY["A09"] ?? buildFallbackConfig("A09", "A-Series — TALENT Intelligence", "Talent Opportunity Intelligence Engine");
  return (
    <DashboardTierGate pillar="A09 — Talent Opportunity Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
