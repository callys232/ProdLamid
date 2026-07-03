"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q16Page() {
  const config = MODULE_REGISTRY["Q16"] ?? buildFallbackConfig("Q16", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Frequency Engine");
  return (
    <DashboardTierGate pillar="Q16 — Quantum Decision Frequency Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
