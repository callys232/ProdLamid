"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q66Page() {
  const config = MODULE_REGISTRY["Q66"] ?? buildFallbackConfig("Q66", "Q-Series — Decision Intelligence", "Portfolio/Group Decision View Engine");
  return (
    <DashboardTierGate pillar="Portfolio/Group Decision View Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
