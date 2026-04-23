import { Milestone } from "@/lib/models/Milestone";
import { Project } from "@/lib/models/Project";
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

    // Notify client
    const project = await Project.findById(milestone.projectId);
    if (project) {
        await createNotification(
            `Milestone "${milestone.title}" has been started.`,
            project.ownerId.toString()
        );
    }

    return milestone;
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

    milestone.status = "approved";
    milestone.completedAt = new Date();
    await milestone.save();

    // Logic to create escrow entry would go here or in a separate call
    return milestone;
};

export const getMilestones = async (projectId: string) => {
    await connectDB();
    return await Milestone.find({ projectId }).sort({ createdAt: 1 });
};

export const getMilestone = async (milestoneId: string) => {
    await connectDB();
    return await Milestone.findById(milestoneId);
};
