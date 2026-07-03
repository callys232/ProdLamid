"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q12Page() {
  const config = MODULE_REGISTRY["Q12"] ?? buildFallbackConfig("Q12", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Universe Engine");
  return (
    <DashboardTierGate pillar="Q12 — Quantum Decision Universe Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
