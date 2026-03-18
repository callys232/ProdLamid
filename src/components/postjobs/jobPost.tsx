"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { Project } from "@/types/project";
import type {
  PhaseInput,
  MilestoneInput,
  ProjectPayload,
  PresignedUploadRequest,
  PresignedUploadResponse,
  CreateProjectResponse,
} from "@/types/projectPosting";

import ProgressBar from "./progressBar";
import DetailsStep from "./detailsStep";
import BudgetStep from "./budgetStep";
import DescriptionStep from "./description";
import ExtrasStep from "./extraStep";
import ReviewStep from "./review";

/* -----------------------------
   Steps
------------------------------*/

const steps = [
  { label: "Details", icon: "📝" },
  { label: "Budget", icon: "💰" },
  { label: "Description", icon: "📄" },
  { label: "Extras", icon: "✨" },
  { label: "Review", icon: "✅" },
];

interface JobPostingFormProps {
  onSubmit: (project: Project) => void;
  onDraftSave?: (payload: ProjectPayload) => void;
}

/* =====================================================
   JobPostingForm
===================================================== */

export default function JobPostingForm({
  onSubmit,
  onDraftSave,
}: JobPostingFormProps) {

  /* -----------------------------
     Premium Mode (FOR TESTING)
  ------------------------------*/

  const premiumUser = true;

  const tagVisibility = premiumUser;
  const enableAIBudget = premiumUser;
  const enableConsultantMatching = premiumUser;

  /* -----------------------------
     Project State
  ------------------------------*/

  const [project, setProject] = useState<Project>({
    id: "",
    title: "",
    category: "",
    description: "",
    budget: 0,
    hourlyRate: 0,
    skills: [],
    milestones: [],
    deadline: "",
    priority: "",
    status: "",
    images: [],
  });

  /* -----------------------------
     Structured Inputs
  ------------------------------*/

  const [phases, setPhases] = useState<PhaseInput[]>([]);
  const [milestones, setMilestones] = useState<MilestoneInput[]>([]);

  /* -----------------------------
     Images
  ------------------------------*/

  const [images, setImages] = useState<File[]>([]);

  /* -----------------------------
     Smart Tags
  ------------------------------*/

  const [tags, setTags] = useState<string[]>([]);

  /* -----------------------------
     Extras
  ------------------------------*/

  const [purpose, setPurpose] = useState("");
  const [extraField, setExtraField] = useState("");

  const [skillInput, setSkillInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);



  /* =====================================================
     FIELD CHANGE
  ===================================================== */

  const handleChange = (field: keyof Project, value: string | number | null) => {
    setProject((prev) => ({
      ...prev,
      [field]: value === null ? null : value,
    }));
  };

  /* =====================================================
     SKILLS
  ===================================================== */

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    if ((project.skills ?? []).includes(trimmed)) {
      setErrors((e) => ({ ...e, skills: "Skill already added." }));
      return;
    }

    setProject((prev) => ({
      ...prev,
      skills: [...(prev.skills ?? []), trimmed],
    }));

    setSkillInput("");
  };

  const removeSkill = (index: number) =>
    setProject((prev) => ({
      ...prev,
      skills: (prev.skills ?? []).filter((_, i) => i !== index),
    }));

  /* =====================================================
     WORK PHASES
  ===================================================== */

  const addPhase = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    setPhases((prev) => [
      ...prev,
      {
        id: `phase-${uuidv4()}`,
        title: trimmed,
        order: prev.length,
      },
    ]);
  };

  const removePhase = (id: string) => {
    setPhases((prev) => prev.filter((p) => p.id !== id));
    setMilestones((prev) => prev.filter((m) => m.workPhaseId !== id));
  };

  /* =====================================================
     MILESTONES
  ===================================================== */

  const addMilestone = (title: string, workPhaseId?: string | null) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const phaseId = workPhaseId ?? phases[phases.length - 1]?.id ?? null;

    setMilestones((prev) => [
      ...prev,
      {
        id: `m-${uuidv4()}`,
        title: trimmed,
        status: "pending",
        workPhaseId: phaseId,
      },
    ]);
  };

  const removeMilestone = (index: number) =>
    setMilestones((prev) => prev.filter((_, i) => i !== index));

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!project.title?.trim()) newErrors.title = "Title required";
      if (!project.category?.trim()) newErrors.category = "Category required";
      if (!project.deadline) newErrors.deadline = "Deadline required";
    }

    if (step === 1) {
      if (!project.budget && !project.hourlyRate)
        newErrors.budget = "Budget or hourly rate required";
    }

    if (step === 2) {
      if (!project.description || project.description.length < 10)
        newErrors.description = "Description must be at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =====================================================
     BUILD PAYLOAD
  ===================================================== */

  function buildProjectPayload(): ProjectPayload {
    return {
      clientRequestId: `crid-${uuidv4()}`,
      title: project.title ?? "",
      description: project.description ?? "",
      category: project.category ?? "",
      budget: project.budget ?? undefined,
      hourlyRate: project.hourlyRate ?? undefined,
      deadline: project.deadline ?? null,
      priority: project.priority ?? undefined,
      type: project.type,
      TaskType: project.TaskType,
      purpose,
      extraField,
      workPhases: phases.map(phase => ({
        id: phase.id,
        name: phase.title,
        description: phase.description,
        order: phase.order,
      })),
      milestones: milestones.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        amount: m.amount,
        dueDate: m.dueDate,
        progress: m.progress,
        status: m.status,
        workPhaseId: m.workPhaseId,
        acceptanceCriteria: m.acceptanceCriteria,
        documents: m.documents?.map(doc => typeof doc === 'string' ? doc : doc.url)
      })),
      skills: project.skills ?? [],
      tags,
      images: [],
      consultants: project.assignedConsultants ?? [],
      suggestedBidRange: project.suggestedBidRange ?? null,
    };
  }

  /* =====================================================
     FINAL SUBMIT
  ===================================================== */

  const handleFinalSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);

    try {
      const payload = buildProjectPayload();

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": payload.clientRequestId ?? "",
        },
        body: JSON.stringify(payload),
      });

      const created: CreateProjectResponse = await res.json();

      onSubmit(created.project);

      setCurrentStep(0);
      setTags([]);
      setPhases([]);
      setMilestones([]);
      setImages([]);

    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        submit: err?.message ?? "Failed to post project",
      }));
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SAVE DRAFT
  ===================================================== */

  const saveDraft = async () => {
    const payload = buildProjectPayload();

    try {
      await fetch("/api/projects/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      onDraftSave?.(payload);
    } catch { }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-white border border-[#c21219] rounded-lg shadow-md p-6 space-y-4"
    >

      <ProgressBar steps={steps} currentStep={currentStep} />

      <div className="bg-red-50 rounded-md p-4">

        {currentStep === 0 && (
          <DetailsStep
            project={project}
            handleChange={handleChange}
            errors={errors}
            tags={tags}
            setTags={setTags}
            tagVisibility={tagVisibility}
          />
        )}

        {currentStep === 1 && (
          <BudgetStep
            project={project}
            handleChange={handleChange}
            errors={errors}
            premiumUser={enableAIBudget}
          />
        )}

        {currentStep === 2 && (
          <DescriptionStep
            description={project.description ?? ""}
            setDescription={(val) => handleChange("description", val)}
            skills={project.skills ?? []}
            setSkills={(val) => handleChange("skills", val)}
            phases={phases}
            addPhase={addPhase}
            removePhase={removePhase}
            milestones={milestones}
            addMilestone={addMilestone}
            removeMilestone={removeMilestone}
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
            phases={phases}
            milestones={milestones}
            tags={tags}
            premiumUser={enableConsultantMatching}
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
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Back
          </button>
        )}

        <div className="flex gap-3">

          <button
            type="button"
            onClick={saveDraft}
            className="px-3 py-2 border rounded-md"
          >
            Save Draft
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                const valid = validateStep(currentStep);
                if (valid) setCurrentStep((prev) => prev + 1);
              }}
              className="px-4 py-2 bg-[#c21219] text-white rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-[#c21219] text-white rounded-md"
            >
              Post Project
            </button>
          )}

        </div>
      </div>

    </form>
  );
}