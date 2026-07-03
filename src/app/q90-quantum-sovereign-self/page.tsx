"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q90Page() {
  const config = MODULE_REGISTRY["Q90"] ?? buildFallbackConfig("Q90", "Q-Series — Quantum Decision Intelligence", "Quantum Sovereign Self Engine");
  return (
    <DashboardTierGate pillar="Q90 — Quantum Sovereign Self Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
