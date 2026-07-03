"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q23Page() {
  const config = MODULE_REGISTRY["Q23"] ?? buildFallbackConfig("Q23", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Architecture Engine");
  return (
    <DashboardTierGate pillar="Q23 — Quantum Decision Architecture Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
