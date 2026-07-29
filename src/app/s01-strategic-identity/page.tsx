"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S01Page() {
  const config = MODULE_REGISTRY["S01"]!;
  return (
    <DashboardTierGate pillar="Strategic Identity Statement" backHref="/intelligence-hub" backLabel="Back to Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
