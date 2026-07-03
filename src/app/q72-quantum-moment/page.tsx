"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q72Page() {
  const config = MODULE_REGISTRY["Q72"] ?? buildFallbackConfig("Q72", "Q-Series — Quantum Decision Intelligence", "Quantum Moment Engine");
  return (
    <DashboardTierGate pillar="Q72 — Quantum Moment Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
