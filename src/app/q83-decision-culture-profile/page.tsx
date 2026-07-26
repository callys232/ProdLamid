"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q83Page() {
  const config = MODULE_REGISTRY["Q83"] ?? buildFallbackConfig("Q83", "Q-Series — Decision Intelligence", "Decision Culture Profile Engine");
  return (
    <DashboardTierGate pillar="Q83 — Decision Culture Profile Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
