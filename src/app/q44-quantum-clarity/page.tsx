"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q44Page() {
  const config = MODULE_REGISTRY["Q44"] ?? buildFallbackConfig("Q44", "Q-Series — Quantum Decision Intelligence", "Quantum Clarity Engine");
  return (
    <DashboardTierGate pillar="Q44 — Quantum Clarity Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
