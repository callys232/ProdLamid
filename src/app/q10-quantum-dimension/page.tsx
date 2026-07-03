"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q10Page() {
  const config = MODULE_REGISTRY["Q10"] ?? buildFallbackConfig("Q10", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Dimension Engine");
  return (
    <DashboardTierGate pillar="Q10 — Quantum Decision Dimension Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
