"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q48Page() {
  const config = MODULE_REGISTRY["Q48"] ?? buildFallbackConfig("Q48", "Q-Series — Quantum Decision Intelligence", "Quantum Perspective Engine");
  return (
    <DashboardTierGate pillar="Q48 — Quantum Perspective Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
