// components/JobPostingForm.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Project } from "@/types/project";
import type {
  PhaseInput,
  MilestoneInput,
  FilePreview,
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

/**
 * JobPostingForm (refactored)
 * - Typed local state using Project + posting input types
 * - File preview lifecycle with URL.revokeObjectURL
 * - Presigned upload placeholder flow (POST /api/uploads/presign-batch)
 * - buildProjectPayload normalization before submit
 * - Step validation, autosave draft hook, and confirm modal
 *
 * Paste this file into components/JobPostingForm.tsx and ensure the other step components
 * and types/projectPosting.ts exist in your project.
 */

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

export default function JobPostingForm({ onSubmit, onDraftSave }: JobPostingFormProps) {
  // Core project draft (partial Project)
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

  // Structured inputs for phases & milestones (client-side)
  const [phases, setPhases] = useState<PhaseInput[]>([]);
  const [milestones, setMilestones] = useState<MilestoneInput[]>([]);

  // File previews for images
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  // UI & extras
  const [purpose, setPurpose] = useState("");
  const [extraField, setExtraField] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  /* -------------------------
     File preview helpers
     ------------------------- */
  function toPreview(file: File): FilePreview {
    return {
      id: uuidv4(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: false,
    };
  }

  function addFiles(files: File[]) {
    const newPreviews = files
      .filter((f) => f.type.startsWith("image/"))
      .map(toPreview)
      .filter((p) => !filePreviews.some((e) => e.name === p.name && e.size === p.size));
    if (newPreviews.length === 0) return;
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  }

  function removePreview(id: string) {
    const fp = filePreviews.find((p) => p.id === id);
    if (fp) {
      try {
        URL.revokeObjectURL(fp.url);
      } catch {
        /* ignore */
      }
    }
    setFilePreviews((prev) => prev.filter((p) => p.id !== id));
  }

  useEffect(() => {
    return () => {
      filePreviews.forEach((p) => {
        try {
          URL.revokeObjectURL(p.url);
        } catch {
          /* ignore */
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------
     Project field helpers
     ------------------------- */
  const handleChange = (field: keyof Project, value: string | number | null) => {
    setProject((prev) => ({
      ...prev,
      [field]: value === null ? null : typeof value === "string" ? value : Number(value),
    }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if ((project.skills ?? []).includes(trimmed)) {
      setErrors((e) => ({ ...e, skills: "Skill already added." }));
      return;
    }
    setProject((prev) => ({ ...prev, skills: [...(prev.skills ?? []), trimmed] }));
    setSkillInput("");
    setErrors((e) => {
      const copy = { ...e };
      delete copy.skills;
      return copy;
    });
  };

  const removeSkill = (index: number) =>
    setProject((prev) => ({ ...prev, skills: (prev.skills ?? []).filter((_, i) => i !== index) }));

  const addPhase = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setPhases((prev) => [...prev, { id: `phase-${uuidv4()}`, title: trimmed, order: prev.length }]);
  };

  const removePhase = (id: string) => {
    setPhases((prev) => prev.filter((p) => p.id !== id));
    // reassign milestones referencing removed phase to last phase or null
    setMilestones((prev) => {
      const remaining = prev.filter((m) => m.workPhaseId !== id);
      return remaining;
    });
  };

  const addMilestone = (title: string, workPhaseId?: string | null) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const phaseId = workPhaseId ?? phases[phases.length - 1]?.id ?? null;
    setMilestones((prev) => [...prev, { id: `m-${uuidv4()}`, title: trimmed, status: "pending", workPhaseId: phaseId }]);
  };

  const removeMilestone = (index: number) => setMilestones((prev) => prev.filter((_, i) => i !== index));

  /* -------------------------
     Validation per step
     ------------------------- */
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!project.title?.trim()) newErrors.title = "Title is required.";
      if (!project.category?.trim()) newErrors.category = "Category is required.";
      if (!project.deadline) newErrors.deadline = "Deadline is required.";
      if (!project.priority) newErrors.priority = "Priority is required.";
      if (!project.status) newErrors.status = "Status is required.";
    }
    if (step === 1) {
      if (!project.budget && !project.hourlyRate) newErrors.budget = "Either budget or hourly rate is required.";
    }
    if (step === 2) {
      if (!project.description || project.description.length < 10) newErrors.description = "Description must be at least 10 characters.";
    }
    if (step === 3) {
      if (purpose.length > 500) newErrors.purpose = "Purpose too long.";
      if (extraField.length > 200) newErrors.extraField = "Extra field too long.";
    }
    if (step === 4) {
      if (!project.title?.trim()) newErrors.title = "Title is required.";
      if (!project.category?.trim()) newErrors.category = "Category is required.";
      if (!project.description || project.description.length < 10) newErrors.description = "Description must be at least 10 characters.";
      if (!project.deadline) newErrors.deadline = "Deadline is required.";
      if (!project.priority) newErrors.priority = "Priority is required.";
      if (!project.status) newErrors.status = "Status is required.";
      if (!project.budget && !project.hourlyRate) newErrors.budget = "Either budget or hourly rate is required.";
      if (purpose.length > 500) newErrors.purpose = "Purpose too long.";
      if (extraField.length > 200) newErrors.extraField = "Extra field too long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------------
     Build payload & upload
     ------------------------- */
  function buildProjectPayload(): ProjectPayload {
    const normalizedPhases = phases.map((p, idx) => ({
      id: p.id ?? `wp-${uuidv4()}`,
      name: p.title,
      description: p.description ?? "",
      order: p.order ?? idx,
      status: "pending" as const,
      duration: p.description ?? "",
    }));

    const normalizedMilestones = milestones.map((m, idx) => ({
      id: m.id ?? `m-${uuidv4()}`,
      title: m.title,
      description: m.description ?? "",
      amount: m.amount ?? 0,
      dueDate: m.dueDate ?? null,
      progress: m.progress ?? 0,
      status: m.status ?? "pending",
      workPhaseId: m.workPhaseId ?? (normalizedPhases[normalizedPhases.length - 1]?.id ?? null),
      acceptanceCriteria: m.acceptanceCriteria ?? "",
      documents: (m.documents ?? []).map((d) => (typeof d === "string" ? d : d.url)),
    }));

    return {
      clientRequestId: `crid-${uuidv4()}`,
      title: project.title ?? "",
      description: project.description ?? "",
      category: project.category ?? "",
      location: project.location ?? "",
      budget: project.budget ?? undefined,
      hourlyRate: project.hourlyRate ?? undefined,
      currency: project.currency ?? undefined,
      startDate: project.startDate ?? null,
      endDate: project.endDate ?? null,
      deadline: project.deadline ?? null,
      priority: project.priority ?? undefined,
      type: project.type,
      TaskType: project.TaskType,
      purpose,
      extraField,
      workPhases: normalizedPhases,
      milestones: normalizedMilestones,
      skills: project.skills ?? [],
      tags: project.tags ?? [],
      images: [], // filled after upload
      consultants: project.assignedConsultants ?? [],
      suggestedBidRange: project.suggestedBidRange ?? null,
    };
  }

  async function uploadFiles(previews: FilePreview[]): Promise<string[]> {
    if (previews.length === 0) return [];
    const reqs: PresignedUploadRequest[] = previews.map((p) => ({ filename: p.name, contentType: p.type, size: p.size }));
    const presignRes = await fetch("/api/uploads/presign-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: reqs }),
    });
    if (!presignRes.ok) throw new Error("Failed to request upload URLs");
    const presigned: PresignedUploadResponse[] = await presignRes.json();

    await Promise.all(
      presigned.map(async (p, i) => {
        const preview = previews[i];
        await fetch(p.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": preview.type },
          body: preview.file,
        });
        preview.uploaded = true;
        preview.remoteUrl = p.publicUrl;
      })
    );

    return presigned.map((p) => p.publicUrl);
  }

  /* -------------------------
     Final submit flow
     ------------------------- */
  const handleFinalSubmit = async () => {
    if (!validateStep(4)) return;
    setLoading(true);
    try {
      const payload = buildProjectPayload();

      // Upload previews and attach URLs
      const publicUrls = await uploadFiles(filePreviews);
      payload.images = publicUrls;

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": payload.clientRequestId ?? "" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Server error" }));
        throw new Error(err?.message ?? "Failed to create project");
      }

      const created: CreateProjectResponse = await res.json();
      onSubmit(created.project);

      // cleanup and revoke previews
      filePreviews.forEach((p) => {
        try {
          URL.revokeObjectURL(p.url);
        } catch {
          /* ignore */
        }
      });

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
      setPhases([]);
      setMilestones([]);
      setFilePreviews([]);
      setPurpose("");
      setExtraField("");
      setSkillInput("");
      setMilestoneInput("");
      setCurrentStep(0);
      setErrors({});
      setShowConfirm(false);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, submit: err?.message ?? "Failed to post project" }));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     Autosave draft (optional)
     ------------------------- */
  const saveDraft = async () => {
    const payload = buildProjectPayload();
    try {
      await fetch("/api/projects/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onDraftSave?.(payload);
    } catch {
      // silent
    }
  };

  /* -------------------------
     Render
     ------------------------- */
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
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
            addSkill={addSkill}
            removeSkill={removeSkill}
            milestoneInput={milestoneInput}
            setMilestoneInput={setMilestoneInput}
            addMilestone={() => {
              if (milestoneInput.trim()) {
                addMilestone(milestoneInput.trim());
                setMilestoneInput("");
              }
            }}
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
            images={filePreviews.map((p) => p.file)}
            setImages={(files: File[]) => {
              // convert to previews and set
              const previews = files.map(toPreview);
              // revoke old previews
              filePreviews.forEach((p) => {
                try {
                  URL.revokeObjectURL(p.url);
                } catch {
                  /* ignore */
                }
              });
              setFilePreviews(previews);
            }}
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
            images={filePreviews.map((p) => p.file)}
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveDraft}
            className="px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-sm rounded-md text-gray-700"
            title="Save draft"
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
              className="ml-auto px-4 py-2 rounded-md shadow-sm text-sm md:text-base bg-[#c21219] hover:bg-red-700 text-white"
            >
              {currentStep < steps.length - 2 ? "Next" : "Go to Review"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const valid = validateStep(currentStep);
                if (valid) setShowConfirm(true);
              }}
              className="ml-auto px-4 py-2 rounded-md shadow-sm text-sm md:text-base bg-[#c21219] hover:bg-red-700 text-white"
            >
              Post Project
            </button>
          )}
        </div>
      </div>

      {errors.submit && <div className="text-sm text-red-600">{errors.submit}</div>}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Project Posting</h2>
            <p className="text-sm text-gray-700 mb-6">Are you sure you want to post this project? Please review all details carefully.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="px-4 py-2 bg-[#c21219] hover:bg-red-700 text-white rounded-md text-sm"
              >
                {loading ? "Posting..." : "Confirm & Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
