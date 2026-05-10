// mocks/mockConciergeSupport.ts

export type TicketStatus   = "open" | "in-progress" | "resolved";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
}

export const mockSupportTickets: SupportTicket[] = [
  { id: "LCS-001", subject: "Escrow release request — UNDP project",  status: "resolved",    priority: "high",   date: "2 Jun 2026" },
  { id: "LCS-002", subject: "Team member access permissions",          status: "in-progress", priority: "medium", date: "4 Jun 2026" },
  { id: "LCS-003", subject: "Custom report request — Q2 summary",     status: "open",        priority: "low",    date: "6 Jun 2026" },
];
