import apiClient, { getErrorMessage } from "./apiClient";
import type { Project } from "@/types/project";

export interface ProjectFilters {
    category?: string;
    status?: string;
    minBudget?: number;
    maxBudget?: number;
    scope?: string;
}

export interface CreateProjectData {
    title: string;
    category: string;
    description?: string;
    budget?: number;
    hourlyRate?: number;
    location?: string;
    tech?: string;
    skills?: string[];
    deadline?: string;
    type?: number;
}

/**
 * Get all projects with optional filters
 */
export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.category) params.append("category", filters.category);
        if (filters?.status) params.append("status", filters.status);
        if (filters?.minBudget) params.append("minBudget", filters.minBudget.toString());
        if (filters?.maxBudget) params.append("maxBudget", filters.maxBudget.toString());
        if (filters?.scope) params.append("scope", filters.scope);

        const response = await apiClient.get(`/projects?${params.toString()}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching projects:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get single project by ID
 */
export async function getProjectById(id: string): Promise<Project> {
    try {
        const response = await apiClient.get(`/projects/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching project:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Create new project
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
    try {
        const response = await apiClient.post("/projects", data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating project:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Update project
 */
export async function updateProject(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    try {
        const response = await apiClient.put(`/projects/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error("Error updating project:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Delete project
 */
export async function deleteProject(id: string): Promise<void> {
    try {
        await apiClient.delete(`/projects/${id}`);
    } catch (error) {
        console.error("Error deleting project:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Apply to project
 */
export async function applyToProject(projectId: string, bidData: any): Promise<any> {
    try {
        const response = await apiClient.post("/projects/apply", {
            projectId,
            ...bidData
        });
        return response.data.data;
    } catch (error) {
        console.error("Error applying to project:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Save/unsave project
 */
export async function saveProject(projectId: string, save: boolean): Promise<void> {
    try {
        await apiClient.post("/projects/save", { projectId, save });
    } catch (error) {
        console.error("Error saving project:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get project milestones
 */
export async function getProjectMilestones(id: string): Promise<any[]> {
    try {
        const response = await apiClient.get(`/projects/${id}/milestones`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching milestones:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get project escrow transactions
 */
export async function getProjectEscrow(id: string): Promise<any[]> {
    try {
        const response = await apiClient.get(`/projects/${id}/escrow`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching escrow:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get project skills
 */
export async function getProjectSkills(id: string): Promise<string[]> {
    try {
        const response = await apiClient.get(`/projects/${id}/skills`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching skills:", getErrorMessage(error));
        throw error;
    }
}
