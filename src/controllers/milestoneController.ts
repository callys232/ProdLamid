import { Milestone } from "@/lib/models/Milestone";
import { Project } from "@/lib/models/Project";
import { Escrow } from "@/lib/models/Escrow";
import connectDB from "@/lib/db";
import { createNotification } from "@/lib/notification";

export const createMilestone = async (projectId: string, data: any, userId: string) => {
    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");
    
    // Both client (owner) and assigned consultants can create milestones in some platforms
    // But usually client approves them. Following the user's "client/consultant" role for POST.
    
    const milestone = await Milestone.create({
        projectId,
        ...data,
        amount: Math.round(data.amount * 100), // Convert to kobo
        status: "pending"
    });

    return milestone;
};

export const startMilestone = async (milestoneId: string, userId: string) => {
    await connectDB();
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) throw new Error("Milestone not found");

    milestone.status = "started";
    milestone.startedAt = new Date();
    await milestone.save();

    // Create Escrow entry if not exists
    let escrow = await Escrow.findOne({ milestoneId });
    if (!escrow) {
        escrow = await Escrow.create({
            milestoneId: milestone._id,
            amount: milestone.amount,
            status: "pending"
        });
    }

    // Notify client
    const project = await Project.findById(milestone.projectId);
    if (project) {
        await createNotification(
            `Milestone "${milestone.title}" has been started. Please fund the escrow.`,
            project.ownerId.toString()
        );
    }

    return { milestone, escrowRequired: escrow.status === "pending" };
};

export const stopMilestone = async (milestoneId: string, userId: string) => {
    await connectDB();
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) throw new Error("Milestone not found");

    milestone.status = "stopped";
    await milestone.save();

    return milestone;
};

export const disputeMilestone = async (milestoneId: string, data: { notes: string, fileUrl?: string }, userId: string) => {
    await connectDB();
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) throw new Error("Milestone not found");

    milestone.status = "dispute";
    milestone.notes = data.notes;
    milestone.fileUrl = data.fileUrl;
    await milestone.save();

    return milestone;
};

export const approveMilestone = async (milestoneId: string, userId: string) => {
    await connectDB();
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) throw new Error("Milestone not found");

    const escrow = await Escrow.findOne({ milestoneId });
    
    // If escrow not funded, ask client to fund it first
    if (!escrow || escrow.status === "pending") {
        return { 
            success: false, 
            requireFunding: true, 
            message: "Escrow must be funded before milestone can be approved and funds released.",
            escrowId: escrow?._id
        };
    }

    milestone.status = "approved";
    milestone.completedAt = new Date();
    await milestone.save();

    // Release escrow funds
    escrow.status = "released";
    await escrow.save();

    // Notify consultant
    const project = await Project.findById(milestone.projectId);
    if (project) {
        await createNotification(
            `Milestone "${milestone.title}" has been approved! Funds are being released.`,
            project.consultants[0]?.toString() // Stub: assumes first consultant
        );
    }

    return { success: true, milestone };
};

export const getMilestones = async (projectId: string) => {
    await connectDB();
    return await Milestone.find({ projectId }).sort({ createdAt: 1 });
};

export const getMilestone = async (milestoneId: string) => {
    await connectDB();
    return await Milestone.findById(milestoneId);
};
