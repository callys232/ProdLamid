"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A08Page() {
  const config = MODULE_REGISTRY["A08"] ?? buildFallbackConfig("A08", "A-Series — TALENT Intelligence", "Talent Risk Intelligence Engine");
  return (
    <DashboardTierGate pillar="A08 — Talent Risk Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
