// JobPostingForm.tsx
"use client";

import React from "react";
import useJobForm from "@/hooks/useJobForm";
import ProgressBar from "./progressBar";
import DetailsStep from "./detailsStep";
import BudgetStep from "./budgetStep";
import DescriptionStep from "./description";
import ExtrasStep from "./extraStep";
import ReviewStep from "./review";

const steps = [
  { label: "Details", icon: "📝" },
  { label: "Budget", icon: "💰" },
  { label: "Description", icon: "📄" },
  { label: "Extras", icon: "✨" },
  { label: "Review", icon: "✅" },
];

export default function JobPostingForm({ onSubmit, onDraftSave }: any) {
  const {
    project,
    phases,
    milestones,
    skills,
    tags,
    images,
    purpose,
    extraField,
    currentStep,
    errors,
    loading,
    reviewPhases,
    reviewMilestones,
    handleChange,
    addSkill,
    removeSkill,
    addPhase,
    removePhase,
    addMilestone,
    removeMilestone,
    setCurrentStep,
    setTags,
    setPhases,
    setMilestones,
    setImages,
    setPurpose,
    setExtraField,
    validateStep,
    buildPayload,
  } = useJobForm();

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(currentStep + 1);
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(4)) return;
    const payload = buildPayload();
    // submit to API as before
  };

  const saveDraft = async () => {
    const payload = buildPayload();
    onDraftSave?.(payload);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="bg-white border p-6 space-y-4">
      <ProgressBar steps={steps} currentStep={currentStep} />

      {currentStep === 0 && <DetailsStep project={project} handleChange={handleChange} errors={errors} tags={tags} setTags={setTags} tagVisibility={true} />}
      {currentStep === 1 && <BudgetStep project={project} handleChange={handleChange} errors={errors} premiumUser={true} />}
      {currentStep === 2 && <DescriptionStep description={project.description ?? ""} setDescription={(v) => handleChange("description", v)} skills={skills} setSkills={(v) => handleChange("skills", v)} phases={phases} addPhase={addPhase} removePhase={removePhase} milestones={milestones} addMilestone={addMilestone} removeMilestone={removeMilestone} errors={errors} />}
      {currentStep === 3 && <ExtrasStep purpose={purpose} setPurpose={setPurpose} extraField={extraField} setExtraField={setExtraField} errors={errors} images={images} setImages={setImages} />}
      {currentStep === 4 && <ReviewStep project={project} purpose={purpose} extraField={extraField} errors={errors} phases={reviewPhases} milestones={reviewMilestones} tags={tags} premiumUser={true} handleChange={handleChange} setPurpose={setPurpose} setExtraField={setExtraField} images={images} />}

      <div className="flex justify-between pt-2">
        {currentStep > 0 && <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
        <div className="flex gap-3">
          <button type="button" onClick={saveDraft}>Save Draft</button>
          {currentStep < steps.length - 1 ? <button type="button" onClick={handleNext}>Next</button> : <button type="button" onClick={handleFinalSubmit}>Post Project</button>}
        </div>
      </div>
    </form>
  );
}