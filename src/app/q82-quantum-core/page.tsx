"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q82Page() {
  const config = MODULE_REGISTRY["Q82"] ?? buildFallbackConfig("Q82", "Q-Series — Quantum Decision Intelligence", "Quantum Core Engine");
  return (
    <DashboardTierGate pillar="Q82 — Quantum Core Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
