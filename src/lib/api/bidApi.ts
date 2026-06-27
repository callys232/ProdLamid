import apiClient, { getErrorMessage } from "./apiClient";

/**
 * Get all bids with optional filters (projectId, bidderId)
 */
export async function getBids(filters?: { projectId?: string; bidderId?: string }): Promise<any[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.projectId) params.append("projectId", filters.projectId);
        if (filters?.bidderId) params.append("bidderId", filters.bidderId);

        const response = await apiClient.get(`/bids?${params.toString()}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching bids:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get single bid by ID
 */
export async function getBidById(id: string): Promise<any> {
    try {
        const response = await apiClient.get(`/bids/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching bid:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Create new bid
 */
export async function createBid(data: any): Promise<any> {
    try {
        const response = await apiClient.post("/bids", data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating bid:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Update bid
 */
export async function updateBid(id: string, data: any): Promise<any> {
    try {
        const response = await apiClient.put(`/bids/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error("Error updating bid:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Delete bid
 */
export async function deleteBid(id: string): Promise<void> {
    try {
        await apiClient.delete(`/bids/${id}`);
    } catch (error) {
        console.error("Error deleting bid:", getErrorMessage(error));
        throw error;
    }
}
