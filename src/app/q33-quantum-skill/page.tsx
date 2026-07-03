"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q33Page() {
  const config = MODULE_REGISTRY["Q33"] ?? buildFallbackConfig("Q33", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Skill Engine");
  return (
    <DashboardTierGate pillar="Q33 — Quantum Decision Skill Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
