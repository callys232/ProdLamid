"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A24Page() {
  const config = MODULE_REGISTRY["A24"] ?? buildFallbackConfig("A24", "A-Series — TALENT Intelligence", "Performance & Capability Alignment Engine");
  return (
    <DashboardTierGate pillar="Performance & Capability Alignment" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
