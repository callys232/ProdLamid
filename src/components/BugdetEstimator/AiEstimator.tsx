"use client";
import { useState } from "react";

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

export default function EstimatorContent() {
    const { estimate } = useEstimator();

    const [clientSide, setClientSide] = useState({
        trainingHours: 40,
        workshopCost: 3000,
        adoptionBudget: 5000,
    });

    return (
        <div className="min-h-screen bg-white text-black">

            <header className="bg-black text-white p-4 flex justify-between">
                <h1 className="text-2xl font-bold">Lamid Premium Estimator</h1>
                <ExportOptions data={estimate} />
            </header>

            <main className="p-6 space-y-8">

                <LaborInput />
                <MaterialsInput />
                <TechnologyInput />
                <TimelineInput />
                <RiskInput />
                <RegulatoryInput />
                <ClientSideInput value={clientSide} onChange={setClientSide} />
                <QAInput />
                <SustainabilityInput />
                <VendorInput />
                <LifecycleInput />
                <FinancingInput />

                <EstimateSummary estimate={estimate} />
            </main>
        </div>
    );
}