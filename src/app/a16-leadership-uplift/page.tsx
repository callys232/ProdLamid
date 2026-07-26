"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A16Page() {
  const config = MODULE_REGISTRY["A16"] ?? buildFallbackConfig("A16", "A-Series — TALENT Intelligence", "Talent Leadership Uplift Engine");
  return (
    <DashboardTierGate pillar="A16 — Talent Leadership Uplift Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
