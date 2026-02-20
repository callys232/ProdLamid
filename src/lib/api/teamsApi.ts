import apiClient, { getErrorMessage } from "./apiClient";

/**
 * Get teams for a client
 */
export async function getClientTeams(ownerId: string): Promise<any> {
    try {
        const response = await apiClient.get(`/teams?ownerId=${ownerId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching teams:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Create a new team
 */
export async function createTeam(data: any): Promise<any> {
    try {
        const response = await apiClient.post("/teams", data);
        return response.data;
    } catch (error) {
        console.error("Error creating team:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Add member to team
 */
export async function addTeamMember(teamId: string, email: string, role?: string): Promise<any> {
    try {
        const response = await apiClient.post(`/teams/${teamId}/members`, { email, role });
        return response.data.data;
    } catch (error) {
        console.error("Error adding team member:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Remove member from team
 */
export async function removeTeamMember(teamId: string, userId: string): Promise<any> {
    try {
        const response = await apiClient.delete(`/teams/${teamId}/members`, { data: { userId } });
        return response.data.data;
    } catch (error) {
        console.error("Error removing team member:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Delete a team
 */
export async function deleteTeam(teamId: string): Promise<any> {
    try {
        const response = await apiClient.delete(`/teams/${teamId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting team:", getErrorMessage(error));
        throw error;
    }
}
