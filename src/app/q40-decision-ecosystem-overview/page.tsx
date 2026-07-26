"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q40Page() {
  const config = MODULE_REGISTRY["Q40"] ?? buildFallbackConfig("Q40", "Q-Series — Decision Intelligence", "Decision Ecosystem Overview Engine");
  return (
    <DashboardTierGate pillar="Q40 — Decision Ecosystem Overview Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
