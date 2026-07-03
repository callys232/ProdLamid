"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import SovereignHero         from "@/components/sovereign/SovereignHero";
import CommandOverview       from "@/components/sovereign/CommandOverview";
import ArtifactsPanel        from "@/components/sovereign/ArtifactsPanel";
import ThroneMatrix          from "@/components/sovereign/ThroneMatrix";
import GovernanceMatrix      from "@/components/sovereign/GovernanceMatrix";
import RealmTimeline         from "@/components/sovereign/RealmTimeline";
import IntegrationPipeline   from "@/components/sovereign/IntegrationPipeline";
import ExpansionBlueprint    from "@/components/sovereign/ExpansionBlueprint";
import OperationalFrameworks from "@/components/sovereign/OperationalFrameworks";
import DecisionMatrix        from "@/components/sovereign/DecisionMatrix";
import MilestonesPanel       from "@/components/sovereign/MilestonesPanel";
import SovereignIntake       from "@/components/sovereign/SovereignIntake";
import { SOVEREIGN_MOCK, type SovereignAssessment } from "@/mocks/sovereign";

export default function SovereignPage() {
  const [assessment, setAssessment] = useState<SovereignAssessment | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showIntake, setShowIntake] = useState(false);

  const runAssessment = async (context: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/ai/sovereign", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(context),
      });
      const data = await res.json();
      if (res.status === 429) throw new Error(data.message + " Preview with demo data instead.");
      if (!res.ok) throw new Error(data.message ?? "Assessment failed.");
      setAssessment(data.result);
      setShowIntake(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Assessment failed.");
    } finally {
      setLoading(false);
    }
  };

  const useMock = () => {
    setAssessment(SOVEREIGN_MOCK);
    setShowIntake(false);
  };

  const data = assessment ?? SOVEREIGN_MOCK;
  const hasRealData = assessment !== null;

  return (
    <DashboardTierGate pillar="Sovereign Architecture" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <div style={{ background: "#070b14", minHeight: "100vh" }}>

        {/* Error banner */}
        {error && (
          <div className="px-6 py-3 bg-[#C9A84C]/10 border-b border-[#C9A84C]/20 text-[11px] text-[#C9A84C] text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {showIntake ? (
            <motion.div key="intake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SovereignIntake onSubmit={runAssessment} loading={loading} onUseMock={useMock} />
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Hero */}
              <SovereignHero
                enterprise={data.enterprise}
                sealScore={data.soverignSealScore}
                onAssess={() => setShowIntake(true)}
                hasData={hasRealData}
              />

              {/* Next action bar (when showing mock — prompts assessment) */}
              {!hasRealData && (
                <div className="border-b border-[#C9A84C]/10 px-6 py-3 flex items-center justify-between gap-4 flex-wrap"
                  style={{ background: "#0a0e1a" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                    <p className="text-[10px] text-[#E8E0CC]/50">Showing demo data — run your own Sovereign Assessment to see personalised results</p>
                  </div>
                  <button type="button" onClick={() => setShowIntake(true)}
                    className="text-[10px] font-bold tracking-widest uppercase border border-[#C9A84C]/25 text-[#C9A84C] px-4 py-1.5 hover:bg-[#C9A84C]/8 transition-colors">
                    ✦ Run Assessment
                  </button>
                </div>
              )}

              {/* Next action bar (when showing real data) */}
              {hasRealData && (
                <div className="border-b border-[#C9A84C]/10 px-6 py-3 flex items-center gap-4 flex-wrap"
                  style={{ background: "#0a0e1a" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7BC98C] animate-pulse" />
                  <p className="text-[10px] text-[#C9A84C]">Next sovereign action:</p>
                  <p className="text-[10px] text-[#E8E0CC]/60 flex-1">{data.nextAction}</p>
                  <button type="button" onClick={() => setShowIntake(true)}
                    className="text-[10px] text-[#E8E0CC]/35 hover:text-[#E8E0CC]/60 transition-colors underline underline-offset-2">
                    New Assessment
                  </button>
                </div>
              )}

              {/* All sections */}
              <CommandOverview       data={data.commandOverview} />
              <ArtifactsPanel        artifacts={data.artifacts} />
              <OperationalFrameworks frameworks={data.frameworks} />
              <ThroneMatrix          thrones={data.thrones} />
              <GovernanceMatrix      tiers={data.governanceTiers} />
              <DecisionMatrix        decisions={data.decisionTypes} />
              <RealmTimeline         realms={data.realms} />
              <IntegrationPipeline   stages={data.integrationStages} />
              <ExpansionBlueprint    vectors={data.expansionVectors} />
              <MilestonesPanel       milestones={data.milestones} />

              {/* Footer seal */}
              <div className="border-t border-[#C9A84C]/10 px-6 py-8 text-center" style={{ background: "#070b14" }}>
                <div className="flex justify-center mb-3">
                  <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                    <path d="M2 19L2 6L9 12.5L14 3L19 12.5L26 6L26 19Z" fill="#C9A84C" opacity="0.3" />
                    <rect x="2" y="19" width="24" height="2" rx="1" fill="#C9A84C" opacity="0.2" />
                  </svg>
                </div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-[#E8E0CC]/20">
                  One Enterprise · Seven Pillars · One Throne · Eternal Sovereignty
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardTierGate>
  );
}
