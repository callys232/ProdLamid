"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function A12Page() {
  const config = MODULE_REGISTRY["A12"] ?? buildFallbackConfig("A12", "A-Series — TALENT Intelligence", "Talent Sentiment Intelligence Engine");
  return (
    <DashboardTierGate pillar="A12 — Talent Sentiment Intelligence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
