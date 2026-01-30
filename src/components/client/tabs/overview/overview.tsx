"use client";

import { SearchBar } from "./searchBar";
import ProjectOverview from "./ProjectOverview";
import { ClientDetails } from "./clientDetails";
import { ConsultantsList } from "./ConsultantsList";
// import { EscrowSection } from "./EscrowSection";
import { InvitationsSection } from "./invitation";
import { AnalyticsSection } from "./analytics";


const mockClient = {
    id: "1",
    name: "Caleb",
    email: "caleb@example.com",
    username: "caleb_user",
    role: "client",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projects: [],
    consultants: [],
    escrowTransactions: [],
    invitations: [],
    teamMembers: [],
    alerts: [],
    notifications: [],
    // Optional fields populated for specific UI checking
    phone: "123-456-7890",
    companyname: "Tech Corp",
    industry: "Software",
    location: "New York",
    isPremium: true,
    registeredAt: "2023-01-01",
    completedProjects: 5,
    rating: 4.8,
    notes: "Top tier client"
};

export default function OverviewPage() {
    return (
        <div className="w-full min-h-screen bg-black text-white p-8 space-y-8">
            {/* 🔍 SearchBar always first */}
            <SearchBar onSearch={(query) => console.log("Searching:", query)} />

            {/* 📊 Project Overview comes next */}
            <ProjectOverview />

            {/* Other sections follow */}
            <ClientDetails client={mockClient} />
            <ConsultantsList consultants={[]} />
            {/* <EscrowSection escrows={[]} /> */}
            <InvitationsSection client={mockClient} consultants={[]} />
            <AnalyticsSection
                analytics={{
                    projects: 5,
                    consultants: 2,
                    budget: 50000,
                    workphrase: 12,
                }}
            />
        </div>
    );
}
