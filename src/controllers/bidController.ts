import { Bid } from "@/lib/models/Bid";
import { Project } from "@/lib/models/Project";
import connectDB from "@/lib/db";
import { createNotification } from "@/lib/notification";

export const acceptBid = async (projectId: string, bidId: string, clientId: string) => {
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");
    if (project.ownerId.toString() !== clientId) throw new Error("Unauthorized");

    const bid = await Bid.findById(bidId);
    if (!bid || bid.projectId.toString() !== projectId) throw new Error("Bid not found");

    // Atomic update: Accept this bid and deny all other bids for this project
    await Bid.findByIdAndUpdate(bidId, { accepted: true, status: "accepted" });
    await Bid.updateMany(
        { projectId, _id: { $ne: bidId } },
        { denied: true, status: "rejected" }
    );

    // Update project status if needed
    project.status = "ongoing";
    await project.save();

    // Notify bidder
    await createNotification(
        `Your bid for project "${project.title}" has been accepted!`,
        bid.bidderId.toString()
    );

    return { success: true };
};

export const denyBid = async (projectId: string, bidId: string, clientId: string) => {
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");
    if (project.ownerId.toString() !== clientId) throw new Error("Unauthorized");

    const bid = await Bid.findByIdAndUpdate(bidId, { denied: true, status: "rejected" }, { new: true });
    if (!bid) throw new Error("Bid not found");

    return { success: true };
};
