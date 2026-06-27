import apiClient, { getErrorMessage } from "./apiClient";

/**
 * Register a new user
 */
export async function register(data: any): Promise<any> {
    try {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Login user
 */
export async function login(data: any): Promise<any> {
    try {
        const response = await apiClient.post("/auth/login", data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Logout user
 */
export async function logout(): Promise<any> {
    try {
        const response = await apiClient.post("/auth/logout");
        return response.data;
    } catch (error) {
        console.error("Error logging out:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get current authenticated user
 */
export async function getMe(): Promise<any> {
    try {
        const response = await apiClient.get("/auth/me");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching current user:", getErrorMessage(error));
        throw error;
    }
}
