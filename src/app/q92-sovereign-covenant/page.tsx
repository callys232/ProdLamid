"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q92Page() {
  const config = MODULE_REGISTRY["Q92"] ?? buildFallbackConfig("Q92", "Q-Series — Quantum Decision Intelligence", "Sovereign Covenant Engine");
  return (
    <DashboardTierGate pillar="Q92 — Sovereign Covenant Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
