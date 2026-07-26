"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q62Page() {
  const config = MODULE_REGISTRY["Q62"] ?? buildFallbackConfig("Q62", "Q-Series — Decision Intelligence", "Domain-Specific Decision View Engine");
  return (
    <DashboardTierGate pillar="Q62 — Domain-Specific Decision View Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
