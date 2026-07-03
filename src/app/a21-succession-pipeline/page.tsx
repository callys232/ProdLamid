"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A21Page() {
  const config = MODULE_REGISTRY["A21"] ?? buildFallbackConfig("A21", "A-Series — TALENT Intelligence", "Succession & Leadership Pipeline Engine");
  return (
    <DashboardTierGate pillar="A21 — Succession & Leadership Pipeline Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
