"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q79Page() {
  const config = MODULE_REGISTRY["Q79"] ?? buildFallbackConfig("Q79", "Q-Series — Quantum Decision Intelligence", "Quantum Singularity Engine");
  return (
    <DashboardTierGate pillar="Q79 — Quantum Singularity Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
