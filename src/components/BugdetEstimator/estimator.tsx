"use client";

import { useEffect, useState } from "react";
import type { ProjectEstimateInput } from "@/types/budgetEstimator";

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

interface EstimatorProps {
    project?: any;
    onResult?: (data: any) => void;
    interactionMode?: any;
}

export default function EstimatorPage({
    project,
    onResult,
}: EstimatorProps) {

    /* ================= CENTRAL STATE ================= */
    const [estimate, setEstimate] = useState<ProjectEstimateInput>({
        businessType: "startup",
        complexity: "medium",
        timeline: {
            durationWeeks: 0,
            milestones: 0,
            urgency: "standard",
        },
        labor: [],
        materials: [],
        technology: [],
        overheads: [],
        risk: { level: "low", contingencyPercent: 0 },
        regulatory: [],
        qa: [],
        clientSide: [],
        sustainability: [],
        vendors: [],
        lifecycle: [],
        financing: [],
    });

    const [clientSide, setClientSide] = useState({
        trainingHours: 40,
        workshopCost: 3000,
        adoptionBudget: 5000,
    });

    /* ================= BACKEND SUGGESTIONS ================= */
    const [suggestions, setSuggestions] = useState<any>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await fetch("/api/estimate/similar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        businessType: estimate.businessType,
                        complexity: estimate.complexity,
                        timeline: estimate.timeline,
                    }),
                });

                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
            }
        };

        fetchSuggestions();
    }, [estimate.businessType, estimate.complexity, estimate.timeline]);

    /* ================= UPDATE ENGINE ================= */
    const updateEstimate = <K extends keyof ProjectEstimateInput>(
        key: K,
        value: ProjectEstimateInput[K]
    ) => {
        setEstimate((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="min-h-screen bg-white text-black">

            {/* ================= HEADER ================= */}
            <header className="bg-black text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Lamid Premium Estimator</h1>
                <ExportOptions data={estimate} />
            </header>

            {/* ================= BODY ================= */}
            <main className="p-4 md:p-8 space-y-6 md:space-y-8">

                {/* ================= LABOR ================= */}
                <section className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#2563EB] mb-4">
                        Labor & Team
                    </h2>

                    <LaborInput />
                </section>

                {/* ================= MATERIALS + TECH ================= */}
                <section className="bg-gray-50 p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#2563EB] mb-4">
                        Materials & Technology
                    </h2>

                    <MaterialsInput />

                    <TechnologyInput />
                </section>

                {/* ================= TIMELINE ================= */}
                <section className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#2563EB] mb-4">
                        Timeline & Overheads
                    </h2>

                    <TimelineInput />
                </section>

                {/* ================= RISK ================= */}
                <section className="bg-blue-50 p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#2563EB] mb-4">
                        Risk & Compliance
                    </h2>

                    <RiskInput />

                    <RegulatoryInput />
                </section>

                {/* ================= CLIENT / QA ================= */}
                <section className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#2563EB] mb-4">
                        Client, QA & Sustainability
                    </h2>

                    <ClientSideInput value={clientSide} onChange={setClientSide} />

                    <QAInput />

                    <SustainabilityInput />
                </section>

                {/* ================= VENDORS ================= */}
                <section className="bg-gray-100 p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#2563EB] mb-4">
                        Vendors & Lifecycle
                    </h2>

                    <VendorInput />

                    <LifecycleInput />
                </section>

                {/* ================= FINANCING + SUMMARY ================= */}
                <section className="bg-black text-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#2563EB] mb-4">
                        Financing & Summary
                    </h2>

                    <FinancingInput />

                    <EstimateSummary
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
                </section>

            </main>
        </div>
    );
}