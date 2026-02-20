import apiClient, { getErrorMessage } from "./apiClient";

/**
 * Get full client profile for dashboard
 */
export async function getClientDashboardProfile(): Promise<any> {
    try {
        const response = await apiClient.get("/client/profile");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching client dashboard profile:", getErrorMessage(error));
        throw error;
    }
}
