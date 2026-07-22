"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q92Page() {
  const config = MODULE_REGISTRY["Q92"] ?? buildFallbackConfig("Q92", "Q-Series — Decision Intelligence", "Partnership Agreement Tracker Engine");
  return (
    <DashboardTierGate pillar="Q92 — Partnership Agreement Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
