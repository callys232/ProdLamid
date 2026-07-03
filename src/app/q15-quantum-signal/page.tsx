"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q15Page() {
  const config = MODULE_REGISTRY["Q15"] ?? buildFallbackConfig("Q15", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Signal Engine");
  return (
    <DashboardTierGate pillar="Q15 — Quantum Decision Signal Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
