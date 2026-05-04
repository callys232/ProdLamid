"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import useJobForm from "@/hooks/useJobForm";
import { Zap, ShoppingCart, AlertTriangle } from "lucide-react";
import Link from "next/link";

const POST_COST = 50;

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

  /* ---------------- POINTS BALANCE ---------------- */
  const [pointsBalance, setPointsBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/points")
      .then(r => r.json())
      .then(d => { if (d.success) setPointsBalance(d.data.balance); })
      .catch(() => {});
  }, []);

  const canAffordPost  = pointsBalance === null || pointsBalance >= POST_COST;
  const afterPostBalance = pointsBalance !== null ? pointsBalance - POST_COST : null;

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
      {/* POINTS BALANCE BANNER */}
      <div className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm border ${
        canAffordPost
          ? "border-gray-200 bg-gray-50 text-gray-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}>
        <div className="flex items-center gap-2">
          {canAffordPost
            ? <Zap className="h-4 w-4 text-[#c12129]" />
            : <AlertTriangle className="h-4 w-4 text-red-500" />}
          <span>
            {pointsBalance === null
              ? "Loading points…"
              : canAffordPost
                ? <>Posting costs <strong>{POST_COST} pts</strong> · You have <strong>{pointsBalance} pts</strong></>
                : <>Not enough points — you need {POST_COST} pts but have {pointsBalance}</>
            }
          </span>
        </div>
        {!canAffordPost && (
          <Link
            href="/client?tab=settings"
            className="flex items-center gap-1 text-xs font-semibold text-[#c12129] hover:underline"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Buy points
          </Link>
        )}
      </div>

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
              className="px-4 py-2 bg-[#c12129] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={!canAffordPost}
              title={!canAffordPost ? `Need ${POST_COST} points to post` : undefined}
              className="flex items-center gap-2 px-4 py-2 bg-[#c12129] text-white rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="h-3.5 w-3.5" />
              Post Project
              {afterPostBalance !== null && canAffordPost && (
                <span className="ml-1 text-xs opacity-75">({afterPostBalance} pts left)</span>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}