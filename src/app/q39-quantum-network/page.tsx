"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q39Page() {
  const config = MODULE_REGISTRY["Q39"] ?? buildFallbackConfig("Q39", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Network Engine");
  return (
    <DashboardTierGate pillar="Q39 — Quantum Decision Network Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
