"use client";

interface Step {
  label: string;
  icon: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div>
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-4 relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={`step-${index}`}
              className="flex-1 flex flex-col items-center relative"
              aria-current={isActive ? "step" : undefined}
            >
              {/* Circle with icon */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg transition-colors duration-300 ${isCompleted
                    ? "bg-[#c21219] border-[#c21219] text-white"
                    : isActive
                      ? "bg-white border-[#c21219] text-[#c21219]"
                      : "border-gray-300 text-gray-500"
                  }`}
              >
                {step.icon}
              </div>

              {/* Label */}
              <span
                className={`mt-1 text-xs font-medium text-center ${isCompleted || isActive ? "text-[#c21219]" : "text-gray-500"
                  }`}
              >
                {step.label}
              </span>

              {/* Tick under circle for completed steps */}
              {isCompleted && (
                <span className="text-[#c21219] text-sm font-bold mt-1">✓</span>
              )}

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-full w-full h-0.5 ${index < currentStep ? "bg-[#c21219]" : "bg-gray-300"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
        <div
          className="h-2 rounded-full bg-[#c21219] transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercent}%` }}
          aria-label={`Progress: ${Math.round(progressPercent)}%`}
        />
      </div>

      {/* Percentage text */}
      <p className="text-xs text-gray-600 text-right">
        {Math.round(progressPercent)}% Complete
      </p>
    </div>
  );
}
