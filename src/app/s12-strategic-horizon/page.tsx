"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S12Page() {
  const config = MODULE_REGISTRY["S12"]!;
  return (
    <DashboardTierGate pillar="S12 — Long-Term Strategic Outlook Engine" backHref="/s11-strategic-wave" backLabel="Back to Market Trend Response Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
