"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q51Page() {
  const config = MODULE_REGISTRY["Q51"] ?? buildFallbackConfig("Q51", "Q-Series — Quantum Decision Intelligence", "Quantum Power Engine");
  return (
    <DashboardTierGate pillar="Q51 — Quantum Power Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
