import apiClient, { getErrorMessage } from "./apiClient";

/**
 * Get all teams with optional filters (ownerId)
 */
export async function getTeams(filters?: { ownerId?: string }): Promise<any[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.ownerId) params.append("ownerId", filters.ownerId);

        const response = await apiClient.get(`/teams?${params.toString()}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching teams:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get single team by ID
 */
export async function getTeamById(id: string): Promise<any> {
    try {
        const response = await apiClient.get(`/teams/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching team:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Create new team
 */
export async function createTeam(data: any): Promise<any> {
    try {
        const response = await apiClient.post("/teams", data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating team:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Update team
 */
export async function updateTeam(id: string, data: any): Promise<any> {
    try {
        const response = await apiClient.put(`/teams/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error("Error updating team:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Delete team
 */
export async function deleteTeam(id: string): Promise<void> {
    try {
        await apiClient.delete(`/teams/${id}`);
    } catch (error) {
        console.error("Error deleting team:", getErrorMessage(error));
        throw error;
    }
}
