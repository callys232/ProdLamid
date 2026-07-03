"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q20Page() {
  const config = MODULE_REGISTRY["Q20"] ?? buildFallbackConfig("Q20", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Texture Engine");
  return (
    <DashboardTierGate pillar="Q20 — Quantum Decision Texture Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
