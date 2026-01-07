import axios, { AxiosInstance, AxiosError } from "axios";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: "/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true // Include cookies in requests
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token from localStorage if available
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle common errors
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    // Optionally redirect to login
                    // window.location.href = "/signin";
                }
            } else if (status === 403) {
                console.error("Forbidden: You don't have permission to access this resource");
            } else if (status === 404) {
                console.error("Resource not found");
            } else if (status >= 500) {
                console.error("Server error occurred");
            }
        } else if (error.request) {
            // Request made but no response received
            console.error("Network error: No response from server");
        } else {
            // Something else happened
            console.error("Error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;

// Helper function to extract error message
export function getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return "An unexpected error occurred";
}

// Helper function to check if response is successful
export function isSuccessResponse(response: any): boolean {
    return response?.data?.success === true;
}
