"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A19Page() {
  const config = MODULE_REGISTRY["A19"] ?? buildFallbackConfig("A19", "A-Series — TALENT Intelligence", "Talent Acceleration Engine — Part III");
  return (
    <DashboardTierGate pillar="A19 — Talent Acceleration Engine — Part III" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
