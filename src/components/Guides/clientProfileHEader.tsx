import { GuideStep } from "@/types/guide";

export const profileGuideSteps: GuideStep[] = [
    {
        id: "profile-overview",
        target: "profile-card",
        title: "Profile Overview",
        description:
            "Displays your identity and public bio information.",
    },
    {
        id: "avatar",
        target: "avatar-upload",
        title: "Profile Photo",
        description:
            "Upload a professional image to increase engagement.",
    },
    {
        id: "actions",
        target: "profile-actions",
        title: "Quick Actions",
        description:
            "Edit profile or send messages from here.",
    },
    {
        id: "projects",
        target: "project-section",
        title: "Project Management",
        description:
            "Toggle between team and individual project views.",
    },
];