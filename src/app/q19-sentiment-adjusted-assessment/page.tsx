"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q19Page() {
  const config = MODULE_REGISTRY["Q19"] ?? buildFallbackConfig("Q19", "Q-Series — Decision Intelligence", "Sentiment-Adjusted Scoring Engine");
  return (
    <DashboardTierGate pillar="Q19 — Sentiment-Adjusted Scoring Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
