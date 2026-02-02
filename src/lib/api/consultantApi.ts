import apiClient, { getErrorMessage } from "./apiClient";
import type { Consultant } from "@/types/client";

export interface ConsultantFilters {
    industry?: string;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
}

/**
 * Get all consultants with optional filters
 */
export async function getConsultants(filters?: ConsultantFilters): Promise<Consultant[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.industry) params.append("industry", filters.industry);
        if (filters?.minRate) params.append("minRate", filters.minRate.toString());
        if (filters?.maxRate) params.append("maxRate", filters.maxRate.toString());
        if (filters?.minRating) params.append("minRating", filters.minRating.toString());

        const response = await apiClient.get(`/consultants?${params.toString()}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching consultants:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get single consultant by ID
 */
export async function getConsultantById(id: string): Promise<Consultant> {
    try {
        const response = await apiClient.get(`/consultants/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching consultant:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Send hire request to consultant
 */
export async function hireConsultant(consultantId: string, message?: string): Promise<void> {
    try {
        await apiClient.post("/hire-consultant", {
            consultantId,
            clientMessage: message
        });
    } catch (error) {
        console.error("Error hiring consultant:", getErrorMessage(error));
        throw error;
    }
}
