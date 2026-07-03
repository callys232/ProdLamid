"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q02Page() {
  const config = MODULE_REGISTRY["Q02"] ?? buildFallbackConfig("Q02", "Q-Series — Quantum Decision Intelligence", "Quantum Decision State Engine");
  return (
    <DashboardTierGate pillar="Q02 — Quantum Decision State Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
