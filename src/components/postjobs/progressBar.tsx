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
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step.label} className="flex-1 flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg ${
                index <= currentStep
                  ? "bg-[#c21219] border-[#c21219] text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {step.icon}
            </div>
            <span
              className={`mt-1 text-xs font-medium ${
                index <= currentStep ? "text-[#c21219]" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 w-full ${
                  index < currentStep ? "bg-[#c21219]" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="h-2 rounded-full bg-[#c21219] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 text-right">
        {Math.round(progressPercent)}% Complete
      </p>
    </div>
  );
}
