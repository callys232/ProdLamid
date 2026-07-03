"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q55Page() {
  const config = MODULE_REGISTRY["Q55"] ?? buildFallbackConfig("Q55", "Q-Series — Quantum Decision Intelligence", "Quantum Velocity Engine");
  return (
    <DashboardTierGate pillar="Q55 — Quantum Velocity Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
