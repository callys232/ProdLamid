"use client";

import { ClientProfile } from "@/types/client";

interface ClientDetailsProps {
    client: ClientProfile;
}

export function ClientDetails({ client }: ClientDetailsProps) {
    return (
        <section className="bg-[#111] border border-white/20 rounded-xl p-6 space-y-6 shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-[#c12129]">Client Details</h2>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem label="Name" value={client.name} />
                <DetailItem label="Email" value={client.email} />
                <DetailItem label="Phone" value={client.phone} />
                <DetailItem label="Company" value={client.companyname} />
                <DetailItem label="Industry" value={client.industry} />
                <DetailItem label="Location" value={client.location} />
            </div>

            {/* Subscription */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                    label="Subscription"
                    value={client.isPremium ? "Premium" : "Standard"}
                    accent={client.isPremium}
                />
                <DetailItem label="Registered On" value={client.registeredAt} />
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem label="Completed Projects" value={client.completedProjects?.toString()} />
                <DetailItem label="Rating" value={`${client.rating ?? 0}/5`} />
            </div>

            {/* Notes */}
            {client.notes && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Notes</h3>
                    <p className="text-gray-400">{client.notes}</p>
                </div>
            )}
        </section>
    );
}

function DetailItem({
    label,
    value,
    accent = false,
}: {
    label: string;
    value?: string | number;
    accent?: boolean;
}) {
    return (
        <div className="flex flex-col bg-black p-3 rounded-lg border border-gray-700 hover:bg-[#1a1a1a] transition">
            <span className="text-sm text-gray-400">{label}</span>
            <span
                className={`text-base font-semibold ${accent ? "text-[#c12129]" : "text-white"
                    }`}
            >
                {value || "—"}
            </span>
        </div>
    );
}
