"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q50Page() {
  const config = MODULE_REGISTRY["Q50"] ?? buildFallbackConfig("Q50", "Q-Series — Quantum Decision Intelligence", "Quantum Mastery Engine");
  return (
    <DashboardTierGate pillar="Q50 — Quantum Mastery Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
