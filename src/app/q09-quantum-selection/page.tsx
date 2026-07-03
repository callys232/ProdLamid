"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q09Page() {
  const config = MODULE_REGISTRY["Q09"] ?? buildFallbackConfig("Q09", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Selection Engine");
  return (
    <DashboardTierGate pillar="Q09 — Quantum Decision Selection Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
