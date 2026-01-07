import { Review } from "../models/Review";

export interface ReviewFilters {
    projectId?: string;
    consultantId?: string;
    userId?: string;
    minRating?: number;
    limit?: number;
    offset?: number;
}

export interface CreateReviewData {
    projectId?: string;
    consultantId?: string;
    userId: string;
    rating: number;
    comment: string;
    reviewerName?: string;
}

/**
 * Get reviews with optional filters
 */
export async function getReviews(filters: ReviewFilters = {}) {
    const query: any = {};

    if (filters.projectId) query.projectId = filters.projectId;
    if (filters.consultantId) query.consultantId = filters.consultantId;
    if (filters.userId) query.userId = filters.userId;
    if (filters.minRating) query.rating = { $gte: filters.minRating };

    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    const reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

    const total = await Review.countDocuments(query);

    return {
        reviews,
        total,
        limit,
        offset
    };
}

/**
 * Create a new review
 */
export async function createReview(data: CreateReviewData) {
    const review = await Review.create({
        projectId: data.projectId,
        consultantId: data.consultantId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment,
        reviewerName: data.reviewerName || "Anonymous"
    });

    return review;
}

/**
 * Get reviews for a specific project
 */
export async function getReviewsByProject(projectId: string, limit = 20, offset = 0) {
    return getReviews({ projectId, limit, offset });
}

/**
 * Get reviews for a specific consultant
 */
export async function getReviewsByConsultant(consultantId: string, limit = 20, offset = 0) {
    return getReviews({ consultantId, limit, offset });
}

/**
 * Get average rating for a consultant
 */
export async function getConsultantAverageRating(consultantId: string): Promise<number> {
    const result = await Review.aggregate([
        { $match: { consultantId } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    return result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
}
