import { useState } from "react";
import type { EstimatorState } from "@/types/budgetEstimator";

export function useEstimator(initial?: Partial<EstimatorState>) {
    const [state, setState] = useState<EstimatorState>({
        businessType: "startup",
        complexity: "medium",
        timeline: {
            durationWeeks: 12,
            milestones: 4,
            urgency: "standard",
        },
        labor: [],
        materials: [],
        technology: [],
        overheads: [],
        risk: { level: "moderate", contingencyPercent: 10 },
        regulatory: [],
        qa: [],
        clientSide: [],
        sustainability: [],
        vendors: [],
        lifecycle: [],
        financing: [],
        ...initial,
    });

    return { state, setState };
}