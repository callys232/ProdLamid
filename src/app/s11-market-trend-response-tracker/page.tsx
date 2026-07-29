"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S11Page() {
  const config = MODULE_REGISTRY["S11"]!;
  return (
    <DashboardTierGate pillar="Market Trend Response Tracker" backHref="/s10-strategic-focus-areas" backLabel="Back to Strategic Focus Areas">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
