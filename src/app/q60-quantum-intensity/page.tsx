"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q60Page() {
  const config = MODULE_REGISTRY["Q60"] ?? buildFallbackConfig("Q60", "Q-Series — Quantum Decision Intelligence", "Quantum Intensity Engine");
  return (
    <DashboardTierGate pillar="Q60 — Quantum Intensity Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
