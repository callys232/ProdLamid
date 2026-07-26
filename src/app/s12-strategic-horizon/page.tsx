"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S12Page() {
  const config = MODULE_REGISTRY["S12"]!;
  return (
    <DashboardTierGate pillar="Long-Term Strategic Outlook Engine" backHref="/s11-market-trend-response-tracker" backLabel="Back to Market Trend Response Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
