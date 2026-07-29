"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A12Page() {
  const config = MODULE_REGISTRY["A12"] ?? buildFallbackConfig("A12", "A-Series — TALENT Intelligence", "Talent Sentiment Intelligence Engine");
  return (
    <DashboardTierGate pillar="Talent Sentiment Intelligence" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
