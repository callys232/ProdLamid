import apiClient, { getErrorMessage } from "./apiClient";

/**
 * Get project analytics
 */
export async function getProjectAnalytics(projectId: string): Promise<any> {
    try {
        const response = await apiClient.get(`/analytics/${projectId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching analytics:", getErrorMessage(error));
        throw error;
    }
}
