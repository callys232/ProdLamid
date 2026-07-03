"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q66Page() {
  const config = MODULE_REGISTRY["Q66"] ?? buildFallbackConfig("Q66", "Q-Series — Quantum Decision Intelligence", "Quantum Empire Engine");
  return (
    <DashboardTierGate pillar="Q66 — Quantum Empire Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
