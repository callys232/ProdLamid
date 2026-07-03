"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A14Page() {
  const config = MODULE_REGISTRY["A14"] ?? buildFallbackConfig("A14", "A-Series — TALENT Intelligence", "Talent Lifecycle Intelligence Engine");
  return (
    <DashboardTierGate pillar="A14 — Talent Lifecycle Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
