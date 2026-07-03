"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A11Page() {
  const config = MODULE_REGISTRY["A11"] ?? buildFallbackConfig("A11", "A-Series — TALENT Intelligence", "Talent Engagement Intelligence Engine");
  return (
    <DashboardTierGate pillar="A11 — Talent Engagement Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
