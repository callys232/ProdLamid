"use client";

import { SearchBar } from "./searchBar";
import ProjectOverview from "./ProjectOverview";
import { ClientDetails } from "./clientDetails";
import { ConsultantsList } from "./ConsultantsList";
// import { EscrowSection } from "./EscrowSection";
import { InvitationsSection } from "./invitation";
import { AnalyticsSection } from "./analytics";


interface OverviewPageProps {
    client: any;
    consultants: any[];
}

export default function OverviewPage({ client, consultants }: OverviewPageProps) {
    return (
        <div className="w-full min-h-screen bg-black text-white p-8 space-y-8">
            {/* 🔍 SearchBar always first */}
            <SearchBar onSearch={(query) => console.log("Searching:", query)} />

            {/* 📊 Project Overview comes next */}
            <ProjectOverview />

            {/* Other sections follow */}
            <ClientDetails client={client} />
            <ConsultantsList consultants={consultants || []} />
            {/* <EscrowSection escrows={client.escrowTransactions || []} /> */}
            <InvitationsSection client={client} consultants={consultants || []} />
            <AnalyticsSection
                analytics={{
                    projects: client.projects?.length || 0,
                    consultants: consultants?.length || 0,
                    budget: client.projects?.reduce((acc: number, p: any) => acc + (p.budget || 0), 0) || 0,
                    workphrase: 12, // Still fallback or keep for now
                }}
            />
        </div>
    );
}
