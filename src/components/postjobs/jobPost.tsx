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
    // project: Project,
    // extras: { purpose: string; extraField: string }
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
  });

  const [purpose, setpurpose] = useState("");
  const [extraField, setExtraField] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Project, value: string) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setProject((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setProject((prev) => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index),
    }));
  };

  const addMilestone = () => {
    if (milestoneInput.trim()) {
      setProject((prev) => ({
        ...prev,
        milestones: [
          ...(prev.milestones || []),
          { title: milestoneInput.trim(), status: "pending" },
        ],
      }));
      setMilestoneInput("");
    }
  };

  const removeMilestone = (index: number) => {
    setProject((prev) => ({
      ...prev,
      milestones: prev.milestones?.filter((_, i) => i !== index),
    }));
  };

  // ✅ Validation per step
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
      if (project.budget && isNaN(Number(project.budget))) {
        newErrors.budget = "Budget must be a number.";
      }
      if (project.hourlyRate && isNaN(Number(project.hourlyRate))) {
        newErrors.hourlyRate = "Hourly rate must be a number.";
      }
    }

    if (step === 2) {
      if (!project.description || project.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters.";
      }
    }

    if (step === 3) {
      if (purpose.length > 500) {
        newErrors.purpose = "Purpose cannot exceed 500 characters.";
      }
      if (extraField.length > 200) {
        newErrors.extraField = "Extra field cannot exceed 200 characters.";
      }
    }

    if (step === 4) {
      // Final check before submission
      if (purpose.length > 500) {
        newErrors.purpose = "Purpose cannot exceed 500 characters.";
      }
      if (extraField.length > 200) {
        newErrors.extraField = "Extra field cannot exceed 200 characters.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const finalProject = { ...project };
    onSubmit();

    // reset state
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
    });
    setpurpose("");
    setExtraField("");
    setSkillInput("");
    setMilestoneInput("");
    setCurrentStep(0);
    setErrors({});
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#c21219] rounded-lg shadow-lg p-6 space-y-6 text-gray-900"
    >
      <ProgressBar steps={steps} currentStep={currentStep} />

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
          addSkill={addSkill}
          removeSkill={removeSkill}
          milestoneInput={milestoneInput}
          setMilestoneInput={setMilestoneInput}
          addMilestone={addMilestone}
          removeMilestone={removeMilestone}
          errors={errors}
        />
      )}
      {currentStep === 3 && (
        <ExtrasStep
          purpose={purpose}
          setpurpose={setpurpose}
          extraField={extraField}
          setExtraField={setExtraField}
          errors={errors}
        />
      )}
      {currentStep === 4 && (
        <ReviewStep
          project={project}
          purpose={purpose}
          extraField={extraField}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
          >
            Back
          </button>
        )}

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="ml-auto px-6 py-2 bg-[#c21219] hover:bg-red-700 text-white rounded-md shadow-md"
          >
            {currentStep === steps.length - 2 ? "Review" : "Next"}
          </button>
        ) : (
          <button
            type="submit"
            className="ml-auto px-6 py-2 bg-[#c21219] hover:bg-red-700 text-white rounded-md shadow-md"
          >
            Post Project
          </button>
        )}
      </div>
    </form>
  );
}
