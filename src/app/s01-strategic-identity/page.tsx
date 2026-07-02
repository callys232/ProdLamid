"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S01Page() {
  const config = MODULE_REGISTRY["S01"]!;
  return (
    <DashboardTierGate pillar="S01 — Strategic Identity Engine" backHref="/intelligence-hub" backLabel="Back to Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
