"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q64Page() {
  const config = MODULE_REGISTRY["Q64"] ?? buildFallbackConfig("Q64", "Q-Series — Quantum Decision Intelligence", "Quantum Realm Engine");
  return (
    <DashboardTierGate pillar="Q64 — Quantum Realm Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
