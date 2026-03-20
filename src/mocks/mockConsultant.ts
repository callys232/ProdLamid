// mocks/mockConsultant.ts
import type { Consultant } from "@/types/client";

/**
 * Multiple mock consultants for local fallback and testing.
 * Each project includes category and status to satisfy Project type.
 */

export const mockConsultants: Consultant[] = [
    {
        id: "mock-1",
        name: "Jane Doe",
        role: "Senior Strategy Consultant",
        industry: "Technology & Digital Transformation",
        delivery: "Remote",
        rate: 150,
        rating: 4.7,
        email: "jane.doe@example.com",
        experience: 12,
        image: "/images/mock-avatar-1.png",
        skills: ["Digital Strategy", "AI Integration", "ERP Implementation"],
        certifications: ["PMP", "Scrum Master", "MBA"],
        projects: [
            { id: "p1", title: "ERP Rollout for Manufacturing Firm", category: "ERP", status: "completed" }
        ],
        testimonials: [
            { client: "Acme Corp", feedback: "Jane transformed our digital roadmap.", rating: 5 },
        ],
        caseStudies: [
            { title: "AI Adoption in Retail", summary: "Boosted efficiency by 30%", link: "#" },
        ],
        aiMatchScore: 92,
        successRate: 88,
        clientSatisfaction: 95,
        earningsToDate: 250000,
        insuranceCoverage: "Professional Liability Insurance",
        availability: [
            { day: "Monday", slots: ["09:00-12:00", "14:00-17:00"] },
            { day: "Wednesday", slots: ["10:00-16:00"] },
        ],
        verifiedStatus: true,
        location: "Lagos, Nigeria",
        preferredEngagementModel: "fixed",
    },
    {
        id: "mock-2",
        name: "Samuel Okoye",
        role: "Fractional CFO",
        industry: "Finance & Accounting",
        delivery: "Hybrid",
        rate: 200,
        rating: 4.9,
        email: "samuel.okoye@example.com",
        experience: 18,
        image: "/images/mock-avatar-2.png",
        skills: ["Financial Modeling", "M&A", "Cashflow Optimization"],
        certifications: ["ACCA", "CFA Level II"],
        projects: [
            { id: "p2", title: "Cashflow Restructuring for Fintech", category: "Finance", status: "active" },
            { id: "p3", title: "Due Diligence for Series B", category: "M&A", status: "completed" },
        ],
        testimonials: [
            { client: "FinEdge", feedback: "Samuel delivered clear, actionable financial plans.", rating: 5 },
            { client: "GreenBank", feedback: "Excellent governance and reporting setup.", rating: 4 },
        ],
        caseStudies: [
            { title: "Turnaround for Fintech", summary: "Reduced burn by 22% in 6 months", link: "#" },
        ],
        aiMatchScore: 87,
        successRate: 92,
        clientSatisfaction: 93,
        earningsToDate: 420000,
        insuranceCoverage: "Directors & Officers Insurance",
        availability: [
            { day: "Tuesday", slots: ["08:00-11:00", "15:00-18:00"] },
            { day: "Thursday", slots: ["09:00-13:00"] },
        ],
        verifiedStatus: true,
        location: "Abuja, Nigeria",
        preferredEngagementModel: "retainer",
    },
    // ... add other mock consultants similarly
];

export const mockConsultant: Consultant = mockConsultants[0];
