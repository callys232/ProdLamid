import apiClient, { getErrorMessage } from "./apiClient";

export interface ReviewFilters {
    projectId?: string;
    consultantId?: string;
    minRating?: number;
    limit?: number;
    offset?: number;
}

export interface CreateReviewData {
    projectId?: string;
    consultantId?: string;
    rating: number;
    comment: string;
    reviewerName?: string;
}

export interface Review {
    _id?: string;
    id?: string;
    projectId?: string;
    consultantId?: string;
    userId: string;
    rating: number;
    comment: string;
    reviewerName?: string;
    createdAt?: string;
}

/**
 * Get reviews with optional filters
 */
export async function getReviews(filters?: ReviewFilters): Promise<{ reviews: Review[]; total: number }> {
    try {
        const params = new URLSearchParams();
        if (filters?.projectId) params.append("projectId", filters.projectId);
        if (filters?.consultantId) params.append("consultantId", filters.consultantId);
        if (filters?.minRating) params.append("minRating", filters.minRating.toString());
        if (filters?.limit) params.append("limit", filters.limit.toString());
        if (filters?.offset) params.append("offset", filters.offset.toString());

        const response = await apiClient.get(`/reviews?${params.toString()}`);
        return {
            reviews: response.data.data || [],
            total: response.data.total || 0
        };
    } catch (error) {
        console.error("Error fetching reviews:", getErrorMessage(error));
        throw error;
    }
}

/**
 * Create a new review
 */
export async function createReview(data: CreateReviewData): Promise<Review> {
    try {
        const response = await apiClient.post("/reviews", data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating review:", getErrorMessage(error));
        throw error;
    }
}
