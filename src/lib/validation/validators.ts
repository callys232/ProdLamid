import { z } from "zod";

export const MilestoneSchemaValidator = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    amount: z.number().positive("Amount must be positive"),
    notes: z.string().optional(),
    fileUrl: z.string().url("Invalid file URL").optional().or(z.literal("")),
});

export const DisputeSchemaValidator = z.object({
    notes: z.string().min(1, "Dispute notes are required"),
    fileUrl: z.string().url("Invalid file URL").optional().or(z.literal("")),
});

export const MessageSchemaValidator = z.object({
    message: z.string().optional(),
    type: z.enum(["text", "milestone_start", "milestone_stop", "dispute", "approval"]).default("text"),
    milestoneId: z.string().optional(),
    fileUrl: z.string().url("Invalid file URL").optional().or(z.literal("")),
});
