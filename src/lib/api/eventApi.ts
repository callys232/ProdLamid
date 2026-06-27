import apiClient, { getErrorMessage } from "./apiClient";

export interface EventFilters {
    type?: "hcd" | "biz" | "general";
    category?: string;
}

export interface Event {
    _id?: string;
    id?: string;
    title: string;
    description?: string;
    image?: string;
    images?: Array<{ path: string; alt?: string }>;
    date?: string;
    time?: string;
    location?: string;
    category?: string;
    type?: "hcd" | "biz" | "general";
    eventTitle?: string;
}

/**
 * Get all events with optional filters
 */
export async function getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.type) params.append("type", filters.type);
        if (filters?.category) params.append("category", filters.category);

        const response = await apiClient.get(`/events?${params.toString()}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching events:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Get single event by ID
 */
export async function getEventById(id: string): Promise<Event> {
    try {
        const response = await apiClient.get(`/events/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching event:", getErrorMessage(error));
        throw error;
    }
}
