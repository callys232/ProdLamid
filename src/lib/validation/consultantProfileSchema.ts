import { z } from "zod";

export const consultantProfileSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    location: z.string().min(2, "City is required"),
    title: z.string().min(2, "Professional title is required"),
    photo: z.instanceof(File).optional(),
    skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
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