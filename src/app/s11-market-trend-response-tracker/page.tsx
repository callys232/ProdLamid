"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";

export default function S11Page() {
  const config = MODULE_REGISTRY["S11"]!;
  return (
    <DashboardTierGate pillar="S11 — Market Trend Response Tracker Engine" backHref="/s10-strategic-orbit" backLabel="Back to Strategic Focus Areas">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
