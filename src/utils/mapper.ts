import { Milestone, WorkPhase } from "@/types/project";

/**
 * Converts milestones into client-facing work phases
 * Non-destructive, order-preserving, dashboard-safe
 */
export function mapMilestonesToWorkPhases(
    milestones: Milestone[] = []
): WorkPhase[] {
    return milestones.map((milestone, index) => {
        const status = derivePhaseStatus(milestone.status, milestone.progress);

        return {
            id: milestone.id || milestone._id,
            name: milestone.title,
            description: milestone.description,
            duration: deriveDuration(milestone),
            order: index + 1,
            status,
        };
    });
}

/* -------------------- HELPERS -------------------- */

function derivePhaseStatus(
    status?: Milestone["status"],
    progress?: number
): WorkPhase["status"] {
    if (status === "completed" || progress === 100) return "completed";
    if (
        status === "in_progress" ||
        status === "funded" ||
        status === "released" ||
        (progress && progress > 0)
    )
        return "active";
    return "pending";
}

function deriveDuration(milestone: Milestone): string {
    if (milestone.deadline) {
        return `Until ${new Date(milestone.deadline).toLocaleDateString()}`;
    }

    if (milestone.dueDate) {
        return `Due ${new Date(milestone.dueDate).toLocaleDateString()}`;
    }

    return "TBD";
}
