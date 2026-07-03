"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A20Page() {
  const config = MODULE_REGISTRY["A20"] ?? buildFallbackConfig("A20", "A-Series — TALENT Intelligence", "Talent Acceleration Engine — Part IV");
  return (
    <DashboardTierGate pillar="A20 — Talent Acceleration Engine — Part IV" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
