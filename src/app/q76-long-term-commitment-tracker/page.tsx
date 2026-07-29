"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q76Page() {
  const config = MODULE_REGISTRY["Q76"] ?? buildFallbackConfig("Q76", "Q-Series — Decision Intelligence", "Long-Term Commitment Tracker Engine");
  return (
    <DashboardTierGate pillar="Long-Term Commitment Tracker" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
