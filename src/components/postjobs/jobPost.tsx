"use client";

import { useState } from "react";
import type { Project } from "@/types/project";

import ProgressBar    from "./progressBar";
import DetailsStep    from "./detailsStep";
import BudgetStep     from "./budgetStep";
import DescriptionStep from "./description";
import ExtrasStep     from "./extraStep";
import ReviewStep     from "./review";

interface JobPostingFormProps {
  onSubmit: (project: Project) => void;
}

const steps = [
  { label: "Details",     icon: "📝" },
  { label: "Budget",      icon: "💰" },
  { label: "Description", icon: "📄" },
  { label: "Extras",      icon: "✨" },
  { label: "Review",      icon: "✅" },
];

const BLANK: Project = {
  id: "", title: "", category: "", description: "",
  location: "", budget: 0, hourlyRate: 0,
  skills: [], milestones: [], deadline: "", priority: "", status: "",
};

export default function JobPostingForm({ onSubmit }: JobPostingFormProps) {
  const [project,        setProject]        = useState<Project>(BLANK);
  const [comment,        setComment]        = useState("");
  const [extraField,     setExtraField]     = useState("");
  const [skillInput,     setSkillInput]     = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [currentStep,    setCurrentStep]    = useState(0);
  const [direction,      setDirection]      = useState<"fwd" | "bck">("fwd");
  const [errors,         setErrors]         = useState<Record<string, string>>({});

  const handleChange = (field: keyof Project, value: string) =>
    setProject((prev) => ({ ...prev, [field]: value }));

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setProject((prev) => ({ ...prev, skills: [...(prev.skills ?? []), skillInput.trim()] }));
    setSkillInput("");
  };
  const removeSkill = (i: number) =>
    setProject((prev) => ({ ...prev, skills: prev.skills?.filter((_, idx) => idx !== i) }));

  const addMilestone = () => {
    if (!milestoneInput.trim()) return;
    setProject((prev) => ({
      ...prev,
      milestones: [...(prev.milestones ?? []), { title: milestoneInput.trim(), status: "pending" }],
    }));
    setMilestoneInput("");
  };
  const removeMilestone = (i: number) =>
    setProject((prev) => ({ ...prev, milestones: prev.milestones?.filter((_, idx) => idx !== i) }));

  const validate = (step: number): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!project.title)    e.title    = "Title is required.";
      if (!project.category) e.category = "Category is required.";
      if (!project.deadline) e.deadline = "Deadline is required.";
      if (!project.priority) e.priority = "Priority is required.";
      if (!project.status)   e.status   = "Status is required.";
    }
    if (step === 1) {
      if (!project.budget && !project.hourlyRate)
        e.budget = "Enter a budget or hourly rate.";
      if (project.budget     && isNaN(Number(project.budget)))     e.budget     = "Must be a number.";
      if (project.hourlyRate && isNaN(Number(project.hourlyRate))) e.hourlyRate = "Must be a number.";
    }
    if (step === 2 && (!project.description || project.description.length < 10))
      e.description = "At least 10 characters required.";
    if (step === 3 && comment.length > 500)
      e.comment = "Cannot exceed 500 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validate(currentStep)) return;
    setDirection("fwd");
    setCurrentStep((s) => s + 1);
    setErrors({});
  };

  const goBack = () => {
    setDirection("bck");
    setCurrentStep((s) => s - 1);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(currentStep)) return;
    onSubmit({ ...project, comment, extraField } as Project);
    setProject(BLANK);
    setComment(""); setExtraField(""); setSkillInput(""); setMilestoneInput("");
    setCurrentStep(0); setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm p-7 space-y-7 w-full"
    >
      <ProgressBar steps={steps} currentStep={currentStep} />

      {/* animated step container — key forces remount on step change for CSS animation */}
      <div key={currentStep} className={direction === "fwd" ? "pj-step-fwd" : "pj-step-bck"}>
        {currentStep === 0 && (
          <DetailsStep project={project} handleChange={handleChange} errors={errors} />
        )}
        {currentStep === 1 && (
          <BudgetStep project={project} handleChange={handleChange} errors={errors} />
        )}
        {currentStep === 2 && (
          <DescriptionStep
            project={project} handleChange={handleChange}
            skillInput={skillInput}         setSkillInput={setSkillInput}
            addSkill={addSkill}             removeSkill={removeSkill}
            milestoneInput={milestoneInput} setMilestoneInput={setMilestoneInput}
            addMilestone={addMilestone}     removeMilestone={removeMilestone}
            errors={errors}
          />
        )}
        {currentStep === 3 && (
          <ExtrasStep
            comment={comment}       setComment={setComment}
            extraField={extraField} setExtraField={setExtraField}
            errors={errors}
          />
        )}
        {currentStep === 4 && (
          <ReviewStep project={project} comment={comment} extraField={extraField} />
        )}
      </div>

      {/* navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg
                       transition-all duration-150 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm active:scale-95"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="ml-auto px-7 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg
                       transition-all duration-150 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-px active:scale-95"
          >
            Continue →
          </button>
        ) : (
          <button
            type="submit"
            className="ml-auto px-7 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg
                       transition-all duration-150 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-px active:scale-95"
          >
            Post Project
          </button>
        )}
      </div>
    </form>
  );
}
