"use client";

import React, { useMemo, useCallback, useState } from "react";
import useJobForm from "@/hooks/useJobForm";

/* ---------------- STEP COMPONENTS ---------------- */
import ProgressBar from "./progressBar";
import DetailsStep from "./detailsStep";
import BudgetStep from "./budgetStep";
import DescriptionStep from "./description";
import ExtrasStep from "./extraStep";
import ReviewStep from "./review";

/* ---------------- AI MATCHER ---------------- */
import AIConsultantMatcher from "@/components/AiMatcher/AiConsultantMatcher";

/* ---------------- TYPES ---------------- */
import type { Project, Consultant } from "@/types/aiMatch";

/* ---------------- STEP CONFIG ---------------- */
const steps = [
  { label: "Details", icon: "📝" },
  { label: "Budget", icon: "💰" },
  { label: "Description", icon: "📄" },
  { label: "Extras", icon: "✨" },
  { label: "Review", icon: "✅" },
];

/* ---------------- COMPONENT ---------------- */
export default function JobPostingForm({
  onSubmit,
  onDraftSave,
  isPremiumUser = true,
  consultants = [],
}: {
  onSubmit?: (payload: any) => Promise<void>;
  onDraftSave?: (payload: any) => Promise<void>;
  isPremiumUser?: boolean;
  consultants?: Consultant[];
}) {
  /* ---------------- FORM STATE ---------------- */
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
    reviewPhases,
    reviewMilestones,

    handleChange,
    setSkills,
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

  /* ---------------- AI STATE ---------------- */
  const [showMatcher, setShowMatcher] = useState(false);
  const [aiProject, setAiProject] = useState<Project | null>(null);

  /* ---------------- DERIVED STATE ---------------- */
  const isStepValid = useMemo(() => {
    if (!errors) return true;
    return Object.keys(errors).length === 0;
  }, [errors]);

  const isLastStep = currentStep === steps.length - 1;

  /* ---------------- NAVIGATION ---------------- */
  function handleNext() {
    const isValid = validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handlePrevious() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  /* ---------------- SAVE DRAFT ---------------- */
  async function handleSaveDraft() {
    try {
      const payload = buildPayload();
      if (onDraftSave) await onDraftSave(payload);
    } catch (err) {
      console.error("Draft save failed:", err);
    }
  }

  /* ---------------- FINAL SUBMIT ---------------- */
  async function handleFinalSubmit() {
    if (!validateStep(currentStep)) return;

    try {
      const payload = buildPayload();
      if (onSubmit) await onSubmit(payload);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  }

  /* ---------------- AI MATCH ---------------- */
  function handleRunAIMatch() {
    if (!isPremiumUser) {
      alert("Upgrade to Premium to unlock AI matching");
      return;
    }

    const payload = buildPayload();

    const aiPayload: Project = {
      id: project.id || "draft-id",
      title: payload.title || "Untitled Project",
      description: payload.description || "",
      skills: payload.skills || [],
    };

    setAiProject(aiPayload);
    setShowMatcher(true);
  }

  /* ---------------- STEP RENDER ---------------- */
  function renderStep() {
    switch (currentStep) {
      case 0:
        return (
          <DetailsStep
            project={project}
            handleChange={handleChange}
            errors={errors}
            tags={tags}
            setTags={setTags}
            tagVisibility={true}
          />
        );

      case 1:
        return (
          <BudgetStep
            project={project}
            handleChange={handleChange}
            errors={errors}
            premiumUser={isPremiumUser}
          />
        );

      case 2:
        return (
          <DescriptionStep
            description={project.description ?? ""}
            setDescription={(v: string) => handleChange("description", v)}
            skills={skills}
            setSkills={setSkills}
            phases={phases}
            addPhase={addPhase}
            removePhase={removePhase}
            milestones={milestones}
            addMilestone={addMilestone}
            removeMilestone={removeMilestone}
            errors={errors}
          />
        );

      case 3:
        return (
          <ExtrasStep
            purpose={purpose}
            setPurpose={setPurpose}
            extraField={extraField}
            setExtraField={setExtraField}
            errors={errors}
            images={images}
            setImages={setImages}
          />
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* REVIEW */}
            <ReviewStep
              project={project}
              purpose={purpose}
              extraField={extraField}
              errors={errors}
              phases={reviewPhases}
              milestones={reviewMilestones}
              tags={tags}
              premiumUser={isPremiumUser}
              handleChange={handleChange}
              setPurpose={setPurpose}
              setExtraField={setExtraField}
              images={images}
            />

            {/* AI MATCH BUTTON */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-black">
                    AI Consultant Matching
                  </h3>
                  <p className="text-sm text-gray-500">
                    Find best consultants instantly
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunAIMatch}
                  className="px-4 py-2 bg-[#c12129] text-white rounded-lg hover:bg-red-700"
                >
                  Run AI Match
                </button>
              </div>
            </div>

            {/* AI MATCHER */}
            {showMatcher && aiProject && (
              <AIConsultantMatcher
                project={aiProject}
                consultants={consultants}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  }

  /* ---------------- RENDER FORM ---------------- */
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-white border p-6 space-y-4 rounded-lg shadow-md"
    >
      <ProgressBar steps={steps} currentStep={currentStep} />

      {renderStep()}

      {/* NAVIGATION BUTTONS */}
      <div className="sticky bottom-0 bg-white border-t mt-6 py-3 px-4 flex justify-between">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="px-4 py-2 border rounded"
          >
            Previous
          </button>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 border rounded"
          >
            Save Draft
          </button>

          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid}
              className="px-4 py-2 bg-[#c12129] text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-4 py-2 bg-[#c12129] text-white rounded"
            >
              Post Project
            </button>
          )}
        </div>
      </div>
    </form>
  );
}