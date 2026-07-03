"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q58Page() {
  const config = MODULE_REGISTRY["Q58"] ?? buildFallbackConfig("Q58", "Q-Series — Quantum Decision Intelligence", "Quantum Magnitude Engine");
  return (
    <DashboardTierGate pillar="Q58 — Quantum Magnitude Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
