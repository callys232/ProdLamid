"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q18Page() {
  const config = MODULE_REGISTRY["Q18"] ?? buildFallbackConfig("Q18", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Harmonic Engine");
  return (
    <DashboardTierGate pillar="Q18 — Quantum Decision Harmonic Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
