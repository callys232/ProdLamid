import { Users } from "../models/User";
import { Profile } from "../models/Profile";
import { Project } from "../models/Project";
import { Bid } from "../models/Bid";
import { Team } from "../models/Team";
import { getConsultantById } from "./consultantService";

/**
 * Get full client profile with all related data
 */
export async function getClientProfile(userId: string) {
    // Get user with profile
    const user = await Users.findById(userId)
        .populate("profile")
        .select("-password -__v -verificationCode -refreshTokenJTI")
        .lean();

    if (!user) {
        throw new Error("User not found");
    }

    // Get user's projects
    const projects = await Project.find({ ownerId: userId })
        .sort({ createdAt: -1 })
        .lean();

    // Get bids made by user
    const bids = await Bid.find({ bidderId: userId })
        .populate("projectId")
        .sort({ createdAt: -1 })
        .lean();

    // Get teams user is part of
    const teams = await Team.find({ members: userId })
        .lean();

    // Get consultants user has worked with (from projects)
    const consultantIds = new Set<string>();
    projects.forEach(project => {
        if (project.consultants && Array.isArray(project.consultants)) {
            project.consultants.forEach(id => consultantIds.add(id.toString()));
        }
    });

    const consultants = await Promise.all(
        Array.from(consultantIds).map(id => getConsultantById(id))
    );

    return {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.username,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
        joinedAt: user.joinedAt,
        profile: user.profile,
        projects,
        bids,
        teams,
        consultants: consultants.filter(c => c !== null),
        createdAt: user.joinedAt,
        updatedAt: new Date().toISOString()
    };
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, data: any) {
    const user = await Users.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // Update profile
    const profile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: data },
        { new: true, upsert: true }
    );

    return profile;
}

/**
 * Get profile by user ID
 */
export async function getProfileByUserId(userId: string) {
    const profile = await Profile.findOne({ user: userId }).lean();
    return profile;
}
