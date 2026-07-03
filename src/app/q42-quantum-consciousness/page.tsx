"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q42Page() {
  const config = MODULE_REGISTRY["Q42"] ?? buildFallbackConfig("Q42", "Q-Series — Quantum Decision Intelligence", "Quantum Consciousness Engine");
  return (
    <DashboardTierGate pillar="Q42 — Quantum Consciousness Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
