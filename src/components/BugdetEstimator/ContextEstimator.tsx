"use client";

import { createContext, useContext, useState } from "react";
import type { ProjectEstimateInput } from "@/types/budgetEstimator";

type EstimatorContextType = {
    estimate: ProjectEstimateInput;
    setEstimate: React.Dispatch<React.SetStateAction<ProjectEstimateInput>>;
    updateEstimate: <K extends keyof ProjectEstimateInput>(
        key: K,
        value: ProjectEstimateInput[K]
    ) => void;
};

const EstimatorContext = createContext<EstimatorContextType | null>(null);

export function EstimatorProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [estimate, setEstimate] = useState<ProjectEstimateInput>({
        businessType: "startup",
        complexity: "medium",
        timeline: { durationWeeks: 0, milestones: 0, urgency: "standard" },
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
        <EstimatorContext.Provider value={{ estimate, setEstimate, updateEstimate }}>
            {children}
        </EstimatorContext.Provider>
    );
}

export function useEstimator() {
    const ctx = useContext(EstimatorContext);
    if (!ctx) throw new Error("useEstimator must be used inside EstimatorProvider");
    return ctx;
}