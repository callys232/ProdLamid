import { z } from "zod";

export const consultantProfileSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    location: z.string().min(2, "City is required"),
    title: z.string().min(2, "Professional title is required"),
    photo: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
    skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
    industry: z.string().min(2, "Industry is required"),
    experience: z.number().min(0, "Invalid experience"),
    rate: z.number().min(0, "Invalid rate"),
    socialLinks: z.object({
        linkedin: z.string().url().optional(),
        twitter: z.string().url().optional(),
        github: z.string().url().optional(),
        website: z.string().url().optional(),
    }),
    premium: z.boolean(),
    verified: z.boolean(),
    businessEnrolled: z.boolean(),
});