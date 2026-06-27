"use client";

import React from "react";

export default function BudgetPreviewVideo() {
    return (
        <div className="w-full space-y-3">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <video
                    className="w-full h-full object-cover"
                    controls={false}
                    autoPlay
                    muted
                    loop
                >
                    <source src="/preview/budget-estimator-preview.mp4" type="video/mp4" />
                </video>

                {/* overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-white text-sm font-medium">
                        Preview Mode – Upgrade to unlock full estimator
                    </p>
                </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
                This is a preview of AI Budget Estimator capabilities
            </p>
        </div>
    );
}