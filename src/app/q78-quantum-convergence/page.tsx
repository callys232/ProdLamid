"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q78Page() {
  const config = MODULE_REGISTRY["Q78"] ?? buildFallbackConfig("Q78", "Q-Series — Quantum Decision Intelligence", "Quantum Convergence Engine");
  return (
    <DashboardTierGate pillar="Q78 — Quantum Convergence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
