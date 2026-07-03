"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q28Page() {
  const config = MODULE_REGISTRY["Q28"] ?? buildFallbackConfig("Q28", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Persona Engine");
  return (
    <DashboardTierGate pillar="Q28 — Quantum Decision Persona Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
