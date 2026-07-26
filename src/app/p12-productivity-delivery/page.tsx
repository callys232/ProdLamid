"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P12Page() {
  const config = MODULE_REGISTRY["P12"] ?? buildFallbackConfig("P12", "P-Series — Enterprise Productivity", "Productivity Delivery Engine");
  return (
    <DashboardTierGate pillar="Productivity Delivery Engine" backHref="/p11-productivity-excellence" backLabel="Productivity Excellence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
