import apiClient, { getErrorMessage } from "./apiClient";

/**
 * Submit contact form
 */
export async function submitContactForm(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
}): Promise<any> {
    try {
        const response = await apiClient.post("/contact", data);
        return response.data;
    } catch (error) {
        console.error("Error submitting contact form:", getErrorMessage(error));
        throw error;
    }
}
