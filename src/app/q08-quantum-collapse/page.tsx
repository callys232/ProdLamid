"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q08Page() {
  const config = MODULE_REGISTRY["Q08"] ?? buildFallbackConfig("Q08", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Collapse Engine");
  return (
    <DashboardTierGate pillar="Q08 — Quantum Decision Collapse Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
