// lib/escrowService.ts
import { mockTransactions, mockEscrowSummary, mockProjects } from "@/mocks/mockEscrow";
import type { EscrowTransaction } from "@/types/escrow";

export async function fetchEscrowSummary(currency?: string) {
    try {
        const res = await fetch(`/api/escrow/summary${currency ? `?currency=${currency}` : ""}`);
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        return json.success ? json.data : json;
    } catch {
        return mockEscrowSummary;
    }
}

export async function fetchEscrowTransactions(currency?: string): Promise<EscrowTransaction[]> {
    try {
        const res = await fetch(`/api/escrow/transactions${currency ? `?currency=${currency}` : ""}`);
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        return json.success ? json.data : json;
    } catch {
        return mockTransactions as EscrowTransaction[];
    }
}

export async function fetchProjects() {
    try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        return json.success ? json.data : json;
    } catch {
        return mockProjects;
    }
}
