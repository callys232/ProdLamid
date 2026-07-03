"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q84Page() {
  const config = MODULE_REGISTRY["Q84"] ?? buildFallbackConfig("Q84", "Q-Series — Quantum Decision Intelligence", "Quantum Spirit Engine");
  return (
    <DashboardTierGate pillar="Q84 — Quantum Spirit Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
