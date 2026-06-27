// components/ConversationFlow.tsx
"use client";

import React, { useState } from "react";

interface Step {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
}

interface ConversationFlowProps {
  steps: Step[];
}

export default function ConversationFlow({ steps }: ConversationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = steps.length;

  const goNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      {/* Progress Tracker */}
      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-2">
          Step {currentStep} of {totalSteps}
        </p>
        <div className="bg-[#333] h-2 rounded">
          <div
            className="bg-[#3b82f6] h-2 rounded transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      {steps.map(
        (step) =>
          step.id === currentStep && (
            <div
              key={step.id}
              className="bg-[#1a1a1a] p-4 rounded border border-[#374151]"
            >
              <h4 className="text-white font-semibold mb-2">{step.title}</h4>
              <p className="text-gray-400 text-sm mb-3">{step.description}</p>
              {step.content}
              <div className="mt-4 flex gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-3 py-1 bg-[#0f0f0f] border border-[#374151] text-white rounded"
                  >
                    Back
                  </button>
                )}
                {currentStep < totalSteps && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-3 py-1 bg-[#3b82f6] text-white rounded"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )
      )}
    </div>
  );
}
