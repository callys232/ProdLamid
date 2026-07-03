"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q40Page() {
  const config = MODULE_REGISTRY["Q40"] ?? buildFallbackConfig("Q40", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Ecosystem Engine");
  return (
    <DashboardTierGate pillar="Q40 — Quantum Decision Ecosystem Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
