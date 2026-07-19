"use client";

import React from "react";

interface Step {
  label: string;
  icon: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive    = index === currentStep;
          return (
            <React.Fragment key={step.label}>
              {/* step bubble */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                    "transition-all duration-300 ease-out",
                    isCompleted ? "bg-[#2563EB] text-white shadow-md"                                : "",
                    isActive    ? "bg-[#2563EB] text-white shadow-lg ring-4 ring-blue-100 scale-110" : "",
                    !isCompleted && !isActive ? "bg-white border-2 border-gray-200 text-gray-400"   : "",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M2.5 7.5l3.5 3.5 6-7" stroke="white" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-base leading-none">{step.icon}</span>
                  )}
                </div>
                <span
                  className={[
                    "mt-1.5 text-xs font-semibold transition-colors duration-200 whitespace-nowrap",
                    isActive || isCompleted ? "text-[#2563EB]" : "text-gray-400",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {/* connector segment between steps */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mt-5 mx-1 bg-gray-200 overflow-hidden rounded-full">
                  <div
                    className={[
                      "h-full rounded-full transition-all duration-500 ease-out",
                      index < currentStep ? "w-full bg-[#2563EB]" : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {currentStep < steps.length - 1
            ? `Next: ${steps[currentStep + 1].label}`
            : "Ready to post"}
        </span>
        <span className="text-xs font-semibold text-gray-500">
          {currentStep + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}
