"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q82Page() {
  const config = MODULE_REGISTRY["Q82"] ?? buildFallbackConfig("Q82", "Q-Series — Decision Intelligence", "Core Decision Principles Engine");
  return (
    <DashboardTierGate pillar="Q82 — Core Decision Principles Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
