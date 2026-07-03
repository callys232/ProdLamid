"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A29Page() {
  const config = MODULE_REGISTRY["A29"] ?? buildFallbackConfig("A29", "A-Series — TALENT Intelligence", "Enterprise Integration Engine");
  return (
    <DashboardTierGate pillar="A29 — Enterprise Integration Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
