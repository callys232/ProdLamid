"use client";

import { useState } from "react";
import {
  Users, Package, Cpu, Clock, AlertTriangle,
  Scale, CheckCircle, UserCheck, Leaf, Store,
  RefreshCw, TrendingUp, BarChart2,
} from "lucide-react";

import LaborInput from "./labourInput";
import MaterialsInput from "./materialsInput";
import TechnologyInput from "./TechnologyInput";
import TimelineInput from "./TimelineInput";
import RiskInput from "./riskInput";
import RegulatoryInput from "./RegulatoryInput";
import QAInput from "./QAInput";
import ClientSideInput from "./ClientSideInput";
import SustainabilityInput from "./SustainabilityInput";
import VendorInput from "./VendorInput";
import LifecycleInput from "./LifecycleInput";
import FinancingInput from "./FinancingInput";
import EstimateSummary from "./EstimateSummary";
import ExportOptions from "./ExportOptions";

import { useEstimator } from "./ContextEstimator";

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  accent: string;
  border: string;
  children: React.ReactNode;
}

function Section({ icon, title, accent, border, children }: SectionProps) {
  return (
    <div className={`rounded-2xl border ${border} bg-black/50 overflow-hidden`}>
      <div className={`flex items-center gap-2 border-b ${border} bg-black/40 px-5 py-3`}>
        <span className={accent}>{icon}</span>
        <h2 className={`text-sm font-semibold uppercase tracking-widest ${accent}`}>{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function EstimatorContent() {
  const { estimate } = useEstimator();

  const [clientSide, setClientSide] = useState({
    trainingHours: 40,
    workshopCost: 3000,
    adoptionBudget: 5000,
  });

  return (
    <div className="bg-[#0a0a0a] text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-black px-6 py-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-[#2563EB]" />
          <h1 className="text-lg font-bold text-white">Lamid Premium Estimator</h1>
        </div>
        <ExportOptions data={estimate} />
      </header>

      <main className="space-y-4 p-5">

        <Section icon={<Users size={16} />} title="Labour & Team" accent="text-blue-400" border="border-blue-500/20">
          <LaborInput />
        </Section>

        <Section icon={<Package size={16} />} title="Materials" accent="text-amber-400" border="border-amber-500/20">
          <MaterialsInput />
        </Section>

        <Section icon={<Cpu size={16} />} title="Technology" accent="text-cyan-400" border="border-cyan-500/20">
          <TechnologyInput />
        </Section>

        <Section icon={<Clock size={16} />} title="Timeline & Overheads" accent="text-purple-400" border="border-purple-500/20">
          <TimelineInput />
        </Section>

        <Section icon={<AlertTriangle size={16} />} title="Risk & Compliance" accent="text-blue-400" border="border-blue-500/20">
          <RiskInput />
          <div className="mt-4 border-t border-white/10 pt-4">
            <RegulatoryInput />
          </div>
        </Section>

        <Section icon={<CheckCircle size={16} />} title="Quality Assurance" accent="text-green-400" border="border-green-500/20">
          <QAInput />
        </Section>

        <Section icon={<UserCheck size={16} />} title="Client Side" accent="text-teal-400" border="border-teal-500/20">
          <ClientSideInput value={clientSide} onChange={setClientSide} />
        </Section>

        <Section icon={<Leaf size={16} />} title="Sustainability" accent="text-emerald-400" border="border-emerald-500/20">
          <SustainabilityInput />
        </Section>

        <Section icon={<Store size={16} />} title="Vendors" accent="text-yellow-400" border="border-yellow-500/20">
          <VendorInput />
        </Section>

        <Section icon={<RefreshCw size={16} />} title="Lifecycle" accent="text-sky-400" border="border-sky-500/20">
          <LifecycleInput />
        </Section>

        <Section icon={<TrendingUp size={16} />} title="Financing" accent="text-pink-400" border="border-pink-500/20">
          <FinancingInput />
        </Section>

        <Section icon={<Scale size={16} />} title="Estimate Summary" accent="text-[#2563EB]" border="border-[#2563EB]/30">
          <EstimateSummary
            estimate={estimate}
            laborTotal={0}
            materialsTotal={0}
            technologyTotal={0}
            timelineTotal={0}
            riskTotal={0}
            regulatoryTotal={0}
            qaTotal={0}
            clientTotal={0}
            sustainabilityTotal={0}
            vendorTotal={0}
            lifecycleTotal={0}
            financingTotal={0}
          />
        </Section>

      </main>
    </div>
  );
}
