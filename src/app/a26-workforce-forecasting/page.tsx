"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A26Page() {
  const config = MODULE_REGISTRY["A26"] ?? buildFallbackConfig("A26", "A-Series — TALENT Intelligence", "Workforce Planning & Forecasting Engine");
  return (
    <DashboardTierGate pillar="A26 — Workforce Planning & Forecasting Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
