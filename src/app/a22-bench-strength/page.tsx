"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A22Page() {
  const config = MODULE_REGISTRY["A22"] ?? buildFallbackConfig("A22", "A-Series — TALENT Intelligence", "Leadership Bench Strength Engine");
  return (
    <DashboardTierGate pillar="A22 — Leadership Bench Strength Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
