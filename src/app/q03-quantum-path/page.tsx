"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q03Page() {
  const config = MODULE_REGISTRY["Q03"] ?? buildFallbackConfig("Q03", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Path Engine");
  return (
    <DashboardTierGate pillar="Q03 — Quantum Decision Path Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
