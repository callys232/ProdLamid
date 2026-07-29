"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q72Page() {
  const config = MODULE_REGISTRY["Q72"] ?? buildFallbackConfig("Q72", "Q-Series — Decision Intelligence", "Point-in-Time Snapshot Engine");
  return (
    <DashboardTierGate pillar="Point-in-Time Snapshot" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
