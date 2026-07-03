"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A13Page() {
  const config = MODULE_REGISTRY["A13"] ?? buildFallbackConfig("A13", "A-Series — TALENT Intelligence", "Talent Experience Intelligence Engine");
  return (
    <DashboardTierGate pillar="A13 — Talent Experience Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
