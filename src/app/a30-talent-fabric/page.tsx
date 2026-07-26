"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A30Page() {
  const config = MODULE_REGISTRY["A30"] ?? buildFallbackConfig("A30", "A-Series — TALENT Intelligence", "Enterprise Talent Fabric Engine");
  return (
    <DashboardTierGate pillar="Enterprise Talent Fabric Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
