import apiClient, { getErrorMessage } from "./apiClient";

export interface Notification {
    _id?: string;
    id?: string;
    userId: string;
    type: "activity" | "message" | "alert" | "system";
    title: string;
    message: string;
    severity?: "Low" | "Medium" | "High";
    isRead?: boolean;
    read?: boolean;
    createdAt?: string;
}

/**
 * Get activity notifications
 */
export async function getActivities(limit = 20): Promise<Notification[]> {
    try {
        const response = await apiClient.get(`/notifications/activities?limit=${limit}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching activities:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get message notifications
 */
export async function getMessages(limit = 20): Promise<Notification[]> {
    try {
        const response = await apiClient.get(`/notifications/messages?limit=${limit}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching messages:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get alert notifications
 */
export async function getAlerts(limit = 20): Promise<Notification[]> {
    try {
        const response = await apiClient.get(`/notifications/alerts?limit=${limit}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching alerts:", getErrorMessage(error));
        throw error;
    }
}
