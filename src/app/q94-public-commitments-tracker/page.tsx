"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q94Page() {
  const config = MODULE_REGISTRY["Q94"] ?? buildFallbackConfig("Q94", "Q-Series — Decision Intelligence", "Public Commitments Tracker Engine");
  return (
    <DashboardTierGate pillar="Q94 — Public Commitments Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
