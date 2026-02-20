"use client";

import { useState } from "react";
import type { Project } from "@/types/project";

import ProgressBar from "./progressBar";
import DetailsStep from "./detailsStep";
import BudgetStep from "./budgetStep";
import DescriptionStep from "./description";
import ExtrasStep from "./extraStep";
import ReviewStep from "./review";

interface JobPostingFormProps {
  onSubmit: (
    project: Project & { purpose: string; extraField: string; images: string[] }
  ) => void;
}

const steps = [
  { label: "Details", icon: "📝" },
  { label: "Budget", icon: "💰" },
  { label: "Description", icon: "📄" },
  { label: "Extras", icon: "✨" },
  { label: "Review", icon: "✅" },
];

export default function JobPostingForm({ onSubmit }: JobPostingFormProps) {
  const [project, setProject] = useState<Project>({
    id: "",
    title: "",
    category: "",
    description: "",
    location: "",
    budget: 0,
    hourlyRate: 0,
    skills: [],
    milestones: [],
    deadline: "",
    priority: "",
    status: "",
    images: [],
  });

  const [purpose, setPurpose] = useState("");
  const [extraField, setExtraField] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Project, value: string | number) => {
    setProject((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : Number(value),
    }));
  };

  // 🔎 Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!project.title) newErrors.title = "Title is required.";
      if (!project.category) newErrors.category = "Category is required.";
      if (!project.deadline) newErrors.deadline = "Deadline is required.";
      if (!project.priority) newErrors.priority = "Priority is required.";
      if (!project.status) newErrors.status = "Status is required.";
    }

    if (step === 1) {
      if (!project.budget && !project.hourlyRate) {
        newErrors.budget = "Either budget or hourly rate is required.";
      }
    }

    if (step === 2) {
      if (!project.description || project.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters.";
      }
    }

    if (step === 3) {
      if (purpose.length > 500) newErrors.purpose = "Purpose too long.";
      if (extraField.length > 200) newErrors.extraField = "Extra field too long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🧠 Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== steps.length - 1) {
      const valid = validateStep(currentStep);
      if (valid) setCurrentStep((prev) => prev + 1);
      return;
    }

    if (!validateStep(currentStep)) return;

    // Convert File[] → string[] (URLs for now; replace with upload logic if needed)
    const imageStrings = images.map((file) => URL.createObjectURL(file));

    onSubmit({ ...project, purpose, extraField, images: imageStrings });

    // Reset form
    setProject({
      id: "",
      title: "",
      category: "",
      description: "",
      location: "",
      budget: 0,
      hourlyRate: 0,
      skills: [],
      milestones: [],
      deadline: "",
      priority: "",
      status: "",
      images: [],
    });
    setPurpose("");
    setExtraField("");
    setImages([]);
    setSkillInput("");
    setMilestoneInput("");
    setCurrentStep(0);
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && currentStep < steps.length - 1) {
          e.preventDefault();
          const valid = validateStep(currentStep);
          if (valid) setCurrentStep((prev) => prev + 1);
        }
      }}
      className="bg-white border border-[#c21219] rounded-lg shadow-md p-4 md:p-6 space-y-4 text-gray-900"
    >
      <ProgressBar steps={steps} currentStep={currentStep} />

      <div className="bg-red-50 rounded-md p-3 md:p-4">
        {currentStep === 0 && (
          <DetailsStep project={project} handleChange={handleChange} errors={errors} />
        )}

        {currentStep === 1 && (
          <BudgetStep project={project} handleChange={handleChange} errors={errors} />
        )}

        {currentStep === 2 && (
          <DescriptionStep
            project={project}
            handleChange={handleChange}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSkill={() => {
              if (skillInput.trim()) {
                setProject((prev) => ({
                  ...prev,
                  skills: [...(prev.skills ?? []), skillInput.trim()],
                }));
                setSkillInput("");
              }
            }}
            removeSkill={(index) =>
              setProject((prev) => ({
                ...prev,
                skills: (prev.skills ?? []).filter((_, i) => i !== index),
              }))
            }
            milestoneInput={milestoneInput}
            setMilestoneInput={setMilestoneInput}
            addMilestone={() => {
              if (milestoneInput.trim()) {
                setProject((prev) => ({
                  ...prev,
                  milestones: [
                    ...(prev.milestones ?? []),
                    { title: milestoneInput.trim(), status: "pending" },
                  ],
                }));
                setMilestoneInput("");
              }
            }}
            removeMilestone={(index) =>
              setProject((prev) => ({
                ...prev,
                milestones: (prev.milestones ?? []).filter((_, i) => i !== index),
              }))
            }
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <ExtrasStep
            purpose={purpose}
            setPurpose={setPurpose}
            extraField={extraField}
            setExtraField={setExtraField}
            errors={errors}
            images={images}
            setImages={setImages}
          />
        )}

        {currentStep === 4 && (
          <ReviewStep
            project={project}
            purpose={purpose}
            extraField={extraField}
            errors={errors}
            handleChange={handleChange}
            setPurpose={setPurpose}
            setExtraField={setExtraField}
            images={images}
          />
        )}
      </div>

      <div className="flex justify-between pt-2">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm md:text-base"
          >
            Back
          </button>
        )}

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              const valid = validateStep(currentStep);
              if (valid) setCurrentStep((prev) => prev + 1);
            }}
            className="ml-auto px-4 py-2 rounded-md shadow-sm text-sm md:text-base bg-[#c21219] hover:bg-red-700 text-white"
          >
            {currentStep < steps.length - 2 ? "Next" : "Go to Review"}
          </button>
        ) : (
          <button
            type="submit"
            className="ml-auto px-4 py-2 rounded-md shadow-sm text-sm md:text-base bg-[#c21219] hover:bg-red-700 text-white"
          >
            Post Project
          </button>
        )}
      </div>
    </form>
  );
}
