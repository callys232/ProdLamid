"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q34Page() {
  const config = MODULE_REGISTRY["Q34"] ?? buildFallbackConfig("Q34", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Technique Engine");
  return (
    <DashboardTierGate pillar="Q34 — Quantum Decision Technique Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
