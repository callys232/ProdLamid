"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q86Page() {
  const config = MODULE_REGISTRY["Q86"] ?? buildFallbackConfig("Q86", "Q-Series — Quantum Decision Intelligence", "Quantum Existence Engine");
  return (
    <DashboardTierGate pillar="Q86 — Quantum Existence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
