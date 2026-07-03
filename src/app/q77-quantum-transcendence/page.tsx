"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q77Page() {
  const config = MODULE_REGISTRY["Q77"] ?? buildFallbackConfig("Q77", "Q-Series — Quantum Decision Intelligence", "Quantum Transcendence Engine");
  return (
    <DashboardTierGate pillar="Q77 — Quantum Transcendence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
