// mocks/mockClientProfile.ts

import { ClientProfile } from "@/types/client";
import { Project } from "@/types/project";

/* ------------------------------------------------ */
/* TIMESTAMPS */
/* ------------------------------------------------ */

const now = new Date().toISOString();

/* ------------------------------------------------ */
/* MOCK PROJECTS */
/* ------------------------------------------------ */

export const mockProjects: Project[] = [
    {
        id: "p1",
        title: "Website Redesign",
        category: "Design",
        status: "active",
        description: "Complete overhaul of the company website.",
        budget: 5000,
        deadline: "2026-04-01",
        purpose: "Improve UX and branding",

        suggestedBidRange: { min: 4000, max: 6000 },

        images: ["/mockimages/web1.png", "/mockimages/web2.png"],

        /* ---------------- WORK PHASES ---------------- */

        workPhases: [
            {
                id: "wp1",
                name: "Design",
                duration: "2 weeks",
                status: "completed",
            },
            {
                id: "wp2",
                name: "Development",
                duration: "4 weeks",
                status: "active",
            },
        ],

        /* ---------------- MILESTONES ---------------- */

        milestones: [
            {
                id: "m1",
                title: "Wireframes",
                description: "Initial design sketches",
                amount: 1000,
                dueDate: "2026-02-15",
                progress: 100,
                status: "completed",
                workPhaseId: "wp1",
                documents: [
                    {
                        id: "doc1",
                        name: "wireframes.pdf",
                        url: "/mockdocs/wireframes.pdf",
                        uploadedAt: "2026-02-10",
                    },
                ],
            },
            {
                id: "m2",
                title: "Frontend Build",
                description: "React implementation",
                amount: 2000,
                dueDate: "2026-03-20",
                progress: 40,
                status: "in_progress",
                workPhaseId: "wp2",
                documents: [],
            },
            {
                id: "m3",
                title: "Backend Integration",
                description: "API and database integration",
                amount: 2000,
                dueDate: "2026-03-28",
                progress: 10,
                status: "pending",
                workPhaseId: "wp2",
                documents: [],
            },
        ],

        /* ---------------- CONSULTANTS ---------------- */

        assignedConsultants: [
            {
                id: "c1",
                name: "Jane Doe",
                role: "UI Designer",
                industry: "Design",
                delivery: "Remote",
                rate: 50,
                rating: 4.8,
                schedule: "Mon–Fri, 9–5",
                progress: 100,
                status: "completed",

                availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                reminders: [
                    {
                        id: "r1",
                        message: "Review milestone Wireframes",
                        date: "2026-02-14",
                    },
                ],
            },

            {
                id: "c2",
                name: "John Smith",
                role: "Frontend Dev",
                industry: "Development",
                delivery: "Remote",
                rate: 60,
                rating: 4.6,
                schedule: "Mon–Fri, 10–6",
                progress: 40,
                status: "active",

                availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                reminders: [
                    {
                        id: "r2",
                        message: "Frontend Build due soon",
                        date: "2026-03-18",
                    },
                ],
            },
        ],

        /* ---------------- ESCROW ---------------- */

        escrow: [
            {
                id: "e1",
                projectId: "p1",
                milestoneId: "m1",
                amount: 1000,
                currency: "USD",
                status: "released",
                createdAt: now,
                updatedAt: now
            },
            {
                id: "e2",
                projectId: "p1",
                milestoneId: "m2",
                amount: 2000,
                currency: "USD",
                status: "funded",
                createdAt: now,
                updatedAt: now
            },
        ],

        /* ---------------- ACTIVITY ---------------- */

        activities: [
            {
                id: "a1",
                action: "Milestone Completed",
                user: "Jane Doe",
                timestamp: now,
                details: "Wireframes milestone finished",
            },
        ],
    },

    /* ======================================================== */

    {
        id: "p2",
        title: "Mobile App Launch",
        category: "Development",
        status: "pending",
        description: "Build and launch a cross-platform mobile app.",
        budget: 8000,
        deadline: "2026-05-15",
        purpose: "Expand product reach",

        suggestedBidRange: { min: 7000, max: 9000 },

        images: ["/mockimages/app1.png", "/mockimages/app2.png"],

        workPhases: [
            {
                id: "wp3",
                name: "Prototype",
                duration: "3 weeks",
                status: "pending",
            },
            {
                id: "wp4",
                name: "Beta Release",
                duration: "2 weeks",
                status: "pending",
            },
        ],

        milestones: [
            {
                id: "m4",
                title: "Clickable Prototype",
                description: "Prototype ready for testing",
                amount: 3000,
                dueDate: "2026-04-01",
                progress: 0,
                status: "pending",
                workPhaseId: "wp3",
                documents: [],
            },
            {
                id: "m5",
                title: "Beta Testing",
                description: "Conduct beta testing with selected users",
                amount: 2500,
                dueDate: "2026-05-01",
                progress: 0,
                status: "pending",
                workPhaseId: "wp4",
                documents: [],
            },
            {
                id: "m6",
                title: "App Store Deployment",
                description: "Deploy app to stores",
                amount: 2500,
                dueDate: "2026-05-15",
                progress: 0,
                status: "pending",
                workPhaseId: "wp4",
                documents: [],
            },
        ],

        assignedConsultants: [
            {
                id: "c3",
                name: "Alice Johnson",
                role: "Mobile Dev",
                industry: "Development",
                delivery: "Remote",
                rate: 55,
                rating: 4.7,
                schedule: "Mon–Fri, 9–5",
                progress: 0,
                status: "pending",

                availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],

                reminders: [
                    {
                        id: "r3",
                        message: "Prototype milestone upcoming",
                        date: "2026-03-30",
                    },
                ],
            },
        ],

        escrow: [],
        activities: [],
    },
];

/* ------------------------------------------------ */
/* CLIENT PROFILE */
/* ------------------------------------------------ */

export const mockClient: ClientProfile = {
    id: "client1",
    name: "Acme Corp",
    username: "acmecorp",
    email: "contact@acmecorp.com",

    projects: mockProjects,

    consultants: [
        {
            id: "c1",
            name: "Jane Doe",
            industry: "Design",
            delivery: "Remote",
            rate: 50,
            rating: 4.8,
            role: "UI Designer",
            projects: [mockProjects[0]],
        },
        {
            id: "c2",
            name: "John Smith",
            industry: "Development",
            delivery: "Remote",
            rate: 60,
            rating: 4.6,
            role: "Frontend Dev",
            projects: [mockProjects[0]],
        },
    ],

    teamMembers: [
        {
            id: "t1",
            name: "Team Alpha",
            role: "Project Manager",
            email: "alpha@example.com",
            addedAt: now,
            projects: [mockProjects[1]],
        },
    ],

    escrowTransactions: mockProjects.flatMap((p) => p.escrow || []),

    invitations: [],
    teams: [],

    alerts: [
        {
            id: "alert1",
            type: "milestone",
            message: "Upcoming milestone review",
            createdAt: now,
        },
    ],

    notifications: [
        {
            id: 1,
            type: "escrow",
            message: "Escrow funded for Frontend Build",
            createdAt: now,
        },
    ],

    createdAt: now,
    updatedAt: now,
};