"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q25Page() {
  const config = MODULE_REGISTRY["Q25"] ?? buildFallbackConfig("Q25", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Pattern Engine");
  return (
    <DashboardTierGate pillar="Q25 — Quantum Decision Pattern Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
