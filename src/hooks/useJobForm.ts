// hooks/useJobForm.ts
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { Project } from "@/types/project";
import type {
    PhaseInput,
    MilestoneInput,
    ProjectPayload,
    ProjectDocument,
} from "@/types/projectPosting";
import type { WorkPhase, Milestone } from "@/types/project";

export default function useJobForm(initialProject?: Partial<Project>) {
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
        ...initialProject,
    });

    const [phases, setPhases] = useState<PhaseInput[]>([]);
    const [milestones, setMilestones] = useState<MilestoneInput[]>([]);
    const [skills, setSkills] = useState<string[]>(project.skills ?? []);
    const [tags, setTags] = useState<string[]>(project.tags ?? []);
    const [images, setImages] = useState<File[]>([]);
    const [purpose, setPurpose] = useState(project.purpose ?? "");
    const [extraField, setExtraField] = useState(project.extraField ?? "");
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    /* -----------------------------
       HANDLE FIELD CHANGE
    ------------------------------*/
    const handleChange = (
        field: keyof Project,
        value: string | number | string[] | null
    ) => {
        setProject((prev) => ({
            ...prev,
            [field]: value === null ? null : value,
        }));
    };

    /* -----------------------------
       SKILLS
    ------------------------------*/
    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (!trimmed || skills.includes(trimmed)) return;
        setSkills((prev) => [...prev, trimmed]);
    };

    const removeSkill = (index: number) =>
        setSkills((prev) => prev.filter((_, i) => i !== index));

    /* -----------------------------
       WORK PHASES
    ------------------------------*/
    const addPhase = (title: string) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        setPhases((prev) => [
            ...prev,
            { id: `phase-${uuidv4()}`, title: trimmed, order: prev.length },
        ]);
    };

    const removePhase = (id: string) => {
        setPhases((prev) => prev.filter((p) => p.id !== id));
        setMilestones((prev) => prev.filter((m) => m.workPhaseId !== id));
    };

    /* -----------------------------
       MILESTONES
    ------------------------------*/
    const addMilestone = (title: string, workPhaseId?: string | null) => {
        const trimmed = title.trim();
        if (!trimmed) return;

        const phaseId = workPhaseId ?? phases[phases.length - 1]?.id ?? null;

        setMilestones((prev) => [
            ...prev,
            { id: `m-${uuidv4()}`, title: trimmed, status: "pending", workPhaseId: phaseId },
        ]);
    };

    const removeMilestone = (index: number) =>
        setMilestones((prev) => prev.filter((_, i) => i !== index));

    /* -----------------------------
       STEP VALIDATION
    ------------------------------*/
    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 0) {
            if (!project.title?.trim()) newErrors.title = "Title required";
            if (!project.category?.trim()) newErrors.category = "Category required";
            if (!project.deadline) newErrors.deadline = "Deadline required";
        }
        if (step === 1 && !project.budget && !project.hourlyRate)
            newErrors.budget = "Budget or hourly rate required";
        if (step === 2 && (!project.description || project.description.length < 10))
            newErrors.description = "Description must be at least 10 characters.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* -----------------------------
       INPUT → DOMAIN CONVERSION
    ------------------------------*/
    const reviewPhases: WorkPhase[] = phases.map((p) => ({
        id: p.id,
        name: p.title,
        duration: "TBD",
        description: p.description,
        order: p.order,
    }));

    const reviewMilestones: Milestone[] = milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        amount: m.amount,
        progress: m.progress,
        status: m.status,
        workPhaseId: m.workPhaseId ?? undefined,
        dueDate: m.dueDate ?? undefined,
        acceptanceCriteria: m.acceptanceCriteria,
        documents: m.documents?.map((doc) =>
            typeof doc === "string"
                ? { id: uuidv4(), name: doc.split("/").pop() ?? "document", url: doc, uploadedAt: new Date().toISOString() }
                : doc
        ),
    }));

    /* -----------------------------
       BUILD PAYLOAD
    ------------------------------*/
    const buildPayload = (): ProjectPayload => ({
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
        workPhases: reviewPhases.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            order: p.order,
            duration: p.duration,
        })),
        milestones: reviewMilestones.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            amount: m.amount,
            dueDate: m.dueDate,
            progress: m.progress,
            status: m.status,
            workPhaseId: m.workPhaseId,
            acceptanceCriteria: m.acceptanceCriteria,
            documents: m.documents?.map((d) => d.url),
        })),
        skills,
        tags,
        images: [],
        consultants: project.assignedConsultants ?? [],
        suggestedBidRange: project.suggestedBidRange ?? null,
    });

    return {
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
        setProject,
        setPhases,
        setMilestones,
        setSkills,
        setTags,
        setImages,
        setPurpose,
        setExtraField,
        setCurrentStep,
        setErrors,
        setLoading,
        handleChange,
        addSkill,
        removeSkill,
        addPhase,
        removePhase,
        addMilestone,
        removeMilestone,
        validateStep,
        buildPayload,
        reviewPhases,
        reviewMilestones,
    };
}