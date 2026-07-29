"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S06Page() {
  const config = MODULE_REGISTRY["S06"]!;
  return (
    <DashboardTierGate pillar="Strategy Execution Tracker" backHref="/s05-strategic-rhythm" backLabel="Back to Strategic Execution Cadence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
