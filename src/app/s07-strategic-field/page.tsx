"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S07Page() {
  const config = MODULE_REGISTRY["S07"]!;
  return (
    <DashboardTierGate pillar="S07 — Strategic Cadence Impact Map Engine" backHref="/s06-strategic-flow" backLabel="Back to Strategy Execution Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
