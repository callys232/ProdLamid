"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q93Page() {
  const config = MODULE_REGISTRY["Q93"] ?? buildFallbackConfig("Q93", "Q-Series — Quantum Decision Intelligence", "Sovereign Charter Engine");
  return (
    <DashboardTierGate pillar="Q93 — Sovereign Charter Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
