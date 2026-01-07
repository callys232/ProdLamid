import { Users } from "../models/User";
import { Profile } from "../models/Profile";
import type { Consultant } from "@/types/client";

/**
 * Transform User + Profile to Consultant shape expected by frontend
 */
export function transformUserToConsultant(user: any): Consultant {
    const profile = user.profile || {};

    return {
        id: user._id?.toString() || user.id,
        _id: user._id?.toString(),
        name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user.username || "Unknown",
        industry: profile.industry || "General",
        delivery: profile.delivery || "Remote",
        rate: profile.rate || 0,
        rating: profile.rating || 0,
        role: profile.title || "Consultant",
        image: profile.profilePicture,
        email: user.email,
        experience: profile.experience,
        skills: profile.skills || [],
        projects: []
    };
}

/**
 * Get all consultants (users with role "seller")
 */
export async function getConsultants(filters?: {
    industry?: string;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
}): Promise<Consultant[]> {
    const query: any = { role: "seller", isVerified: true };

    const users = await Users.find(query)
        .populate("profile")
        .select("-password -__v -verificationCode -refreshTokenJTI")
        .lean();

    let consultants = users.map(transformUserToConsultant);

    // Apply filters
    if (filters) {
        if (filters.industry && filters.industry !== "All") {
            consultants = consultants.filter(c => c.industry === filters.industry);
        }
        if (filters.minRate !== undefined) {
            consultants = consultants.filter(c => {
                const rate = typeof c.rate === "string" ? parseFloat(c.rate) : c.rate;
                return rate >= filters.minRate!;
            });
        }
        if (filters.maxRate !== undefined) {
            consultants = consultants.filter(c => {
                const rate = typeof c.rate === "string" ? parseFloat(c.rate) : c.rate;
                return rate <= filters.maxRate!;
            });
        }
        if (filters.minRating !== undefined) {
            consultants = consultants.filter(c => c.rating >= filters.minRating!);
        }
    }

    return consultants;
}

/**
 * Get consultant by ID
 */
export async function getConsultantById(id: string): Promise<Consultant | null> {
    const user = await Users.findById(id)
        .populate("profile")
        .select("-password -__v -verificationCode -refreshTokenJTI")
        .lean();

    if (!user || user.role !== "seller") {
        return null;
    }

    return transformUserToConsultant(user);
}

/**
 * Get consultant by user ID
 */
export async function getConsultantByUserId(userId: string): Promise<Consultant | null> {
    return getConsultantById(userId);
}
