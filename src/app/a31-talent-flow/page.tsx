"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A31Page() {
  const config = MODULE_REGISTRY["A31"] ?? buildFallbackConfig("A31", "A-Series — TALENT Intelligence", "Enterprise Talent Flow Engine");
  return (
    <DashboardTierGate pillar="A31 — Enterprise Talent Flow Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
