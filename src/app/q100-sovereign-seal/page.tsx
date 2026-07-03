"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q100Page() {
  const config = MODULE_REGISTRY["Q100"] ?? buildFallbackConfig("Q100", "Q-Series — Quantum Decision Intelligence", "The Sovereign Seal");
  return (
    <DashboardTierGate pillar="Q100 — The Sovereign Seal" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
