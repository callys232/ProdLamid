"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A25Page() {
  const config = MODULE_REGISTRY["A25"] ?? buildFallbackConfig("A25", "A-Series — TALENT Intelligence", "Career Pathing Engine");
  return (
    <DashboardTierGate pillar="Career Pathing" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
