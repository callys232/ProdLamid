"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R15Page() {
  const config = MODULE_REGISTRY["R15"] ?? buildFallbackConfig("R15", "R-Series — Cadence Intelligence", "Organisational Cadence Profile Engine");
  return (
    <DashboardTierGate pillar="R15 — Organisational Cadence Profile Engine" backHref="/r14-rhythm-pulse" backLabel="Real-Time Cadence Pulse">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
