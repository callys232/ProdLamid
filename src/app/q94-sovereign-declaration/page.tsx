"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q94Page() {
  const config = MODULE_REGISTRY["Q94"] ?? buildFallbackConfig("Q94", "Q-Series — Quantum Decision Intelligence", "Sovereign Declaration Engine");
  return (
    <DashboardTierGate pillar="Q94 — Sovereign Declaration Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
