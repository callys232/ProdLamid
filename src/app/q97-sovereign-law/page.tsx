"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q97Page() {
  const config = MODULE_REGISTRY["Q97"] ?? buildFallbackConfig("Q97", "Q-Series — Quantum Decision Intelligence", "Sovereign Law Engine");
  return (
    <DashboardTierGate pillar="Q97 — Sovereign Law Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
