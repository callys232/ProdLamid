"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q26Page() {
  const config = MODULE_REGISTRY["Q26"] ?? buildFallbackConfig("Q26", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Signature Engine");
  return (
    <DashboardTierGate pillar="Q26 — Quantum Decision Signature Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
