"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q11Page() {
  const config = MODULE_REGISTRY["Q11"] ?? buildFallbackConfig("Q11", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Reality Engine");
  return (
    <DashboardTierGate pillar="Q11 — Quantum Decision Reality Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
