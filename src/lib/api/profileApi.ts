import apiClient, { getErrorMessage } from "./apiClient";

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<any> {
    try {
        const response = await apiClient.get("/client/profile");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching profile:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Update user profile
 */
export async function updateProfile(data: any): Promise<any> {
    try {
        const response = await apiClient.put("/client/profile", data);
        return response.data.data;
    } catch (error) {
        console.error("Error updating profile:", getErrorMessage(error));
        throw error;
    }
}
