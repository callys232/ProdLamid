"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A23Page() {
  const config = MODULE_REGISTRY["A23"] ?? buildFallbackConfig("A23", "A-Series — TALENT Intelligence", "Behavioral Competency Engine");
  return (
    <DashboardTierGate pillar="A23 — Behavioral Competency Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
