"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A26Page() {
  const config = MODULE_REGISTRY["A26"] ?? buildFallbackConfig("A26", "A-Series — TALENT Intelligence", "Workforce Planning Readiness");
  return (
    <DashboardTierGate pillar="Workforce Planning Readiness" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
