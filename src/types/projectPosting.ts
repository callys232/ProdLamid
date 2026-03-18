// types/projectPosting.ts
import type {
    Project,
    ProjectType,
    MilestoneStatus,
    WorkPhase,
    ProjectConsultant,
    ProjectDocument,
} from "./project";

/**
 * Types used by the client posting flow and server payloads.
 * This file intentionally imports core domain types from ./project
 * and defines lightweight input/payload types used during posting.
 */

/* 1) TaskType enum (UI uses TaskType) */
export type TaskType = "single_task" | "shared_task" | "cooperative_task" | "other";

/* 2) Input shapes used by the client form (temporary, may include isPhase marker) */
export interface PhaseInput {
    id?: string; // temporary id (client-side)
    title: string;
    description?: string;
    order?: number;
    isPhase?: true; // marker used in UI when phases are stored inside milestones list
}

export interface MilestoneInput {
    id?: string;
    title: string;
    description?: string;
    amount?: number;
    dueDate?: string | null;
    progress?: number;
    status?: MilestoneStatus;
    workPhaseId?: string | null; // may be assigned client-side
    acceptanceCriteria?: string;
    documents?: (ProjectDocument | string)[]; // allow urls or full doc objects while building
    isPhase?: boolean; // optional marker if UI stores phases inline
}

/* 3) Local preview file wrapper (object URL + original File) */
export interface FilePreview {
    id: string; // uuid for list keys
    file: File;
    url: string; // URL.createObjectURL(file)
    name: string;
    size: number;
    type: string;
    uploaded?: boolean; // whether uploaded to server
    remoteUrl?: string; // final CDN/S3 URL after upload
}

/* 4) Payload shape sent to server when creating/publishing a project */
export interface ProjectPayload {
    clientRequestId?: string; // idempotency key
    title: string;
    description?: string;
    category: string;
    location?: string;
    budget?: number;
    hourlyRate?: number;
    currency?: string;
    startDate?: string | null;
    endDate?: string | null;
    deadline?: string | null;
    priority?: string;
    type?: ProjectType;
    TaskType?: TaskType | string;
    purpose?: string;
    extraField?: string;
    workPhases?: {
        id?: string;
        name: string;
        description?: string;
        order?: number;
        status?: WorkPhase["status"];
        duration?: string;
    }[];
    milestones?: {
        id?: string;
        title: string;
        description?: string;
        amount?: number;
        dueDate?: string | null;
        progress?: number;
        status?: MilestoneStatus;
        workPhaseId?: string | null;
        acceptanceCriteria?: string;
        documents?: string[]; // array of uploaded URLs
    }[];
    skills?: string[];
    tags?: string[];
    images?: string[]; // final uploaded URLs
    consultants?: Partial<ProjectConsultant>[]; // optional initial assignments
    suggestedBidRange?: { min: number; max: number } | null;
}

/* 5) Server responses for uploads and project creation */
export interface PresignedUploadRequest {
    filename: string;
    contentType: string;
    size?: number;
}

export interface PresignedUploadResponse {
    uploadUrl: string; // presigned PUT URL
    key: string; // object key
    publicUrl: string; // final CDN URL to use in payload
    expiresIn?: number;
}

export interface CreateProjectResponse {
    project: Project;
    warnings?: string[];
    requestId?: string;
}

/* DraftProject extends canonical Project with draft metadata */
export interface DraftProject extends Project {
    isDraft: true;
    draftId?: string;
    savedAt?: string;
}

/* 6) Reuse ProjectDocument imported from ./project (allow string | ProjectDocument in inputs)
   If you need a local override, prefer to extend the imported type instead of redefining it. */

/* 7) Optional: Idempotency metadata for client */
export interface IdempotencyMeta {
    clientRequestId: string;
    createdAt?: string;
    status?: "pending" | "completed" | "failed";
}
