"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A15Page() {
  const config = MODULE_REGISTRY["A15"] ?? buildFallbackConfig("A15", "A-Series — TALENT Intelligence", "Talent Capability Uplift Engine");
  return (
    <DashboardTierGate pillar="A15 — Talent Capability Uplift Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
