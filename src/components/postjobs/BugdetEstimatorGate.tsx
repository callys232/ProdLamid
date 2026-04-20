"use client";

import React from "react";
import BudgetEstimator from "../BudgetEstimator/estimator";
import PremiumFeature from "../PremiumFeature";

interface BudgetEstimatorGateProps {
    isPremiumUser: boolean;
    project: any;
    onResult: (data: any) => void;
}

export default function BudgetEstimatorGate({
    isPremiumUser,
    project,
    onResult,
}: BudgetEstimatorGateProps) {

    const handleUpgrade = () => {
        window.location.href = "/subscription";
    };

    return (
        <PremiumFeature
            enabled={isPremiumUser}
            title="AI Budget Estimator"
            description="Run a full AI analysis for precise cost & timeline modeling."
            ctaText="Unlock Estimator"
            href="/subscription"
        >

            <BudgetEstimator
                project={project}
                onResult={onResult}
            />

            {/* preserved micro-context info INSIDE premium state */}
            {isPremiumUser && (
                <p className="text-xs text-gray-400 mt-2">
                    Includes AI budget range, duration prediction & cost breakdown
                </p>
            )}

        </PremiumFeature>
    );
}