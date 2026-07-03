"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q13Page() {
  const config = MODULE_REGISTRY["Q13"] ?? buildFallbackConfig("Q13", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Origin Engine");
  return (
    <DashboardTierGate pillar="Q13 — Quantum Decision Origin Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
