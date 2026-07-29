"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A31Page() {
  const config = MODULE_REGISTRY["A31"] ?? buildFallbackConfig("A31", "A-Series — TALENT Intelligence", "Enterprise Talent Flow Engine");
  return (
    <DashboardTierGate pillar="Enterprise Talent Flow" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
