"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q19Page() {
  const config = MODULE_REGISTRY["Q19"] ?? buildFallbackConfig("Q19", "Q-Series — Decision Intelligence", "Sentiment-Adjusted Assessment");
  return (
    <DashboardTierGate pillar="Sentiment-Adjusted Assessment" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
