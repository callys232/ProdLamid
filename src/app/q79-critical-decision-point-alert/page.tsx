"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q79Page() {
  const config = MODULE_REGISTRY["Q79"] ?? buildFallbackConfig("Q79", "Q-Series — Decision Intelligence", "Critical Decision Point Alert Engine");
  return (
    <DashboardTierGate pillar="Q79 — Critical Decision Point Alert Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
