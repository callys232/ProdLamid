// mocks/useralert.ts

export type AlertType = "alert" | "notification" | "payment" | "deadline";

export type AlertStatus = "pending" | "completed" | "overdue" | "info";

export interface UserAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  date: string; // ISO string
  status?: AlertStatus;
}

export const mockAlerts: UserAlert[] = [
  {
    id: "alert-1",
    type: "alert",
    title: "Escrow Pending",
    message: "Your escrow for Project A is awaiting confirmation.",
    date: "2026-01-15T10:00:00Z",
    status: "pending",
  },
  {
    id: "alert-2",
    type: "alert",
    title: "Payment Overdue",
    message: "Payment for Project B is overdue by 3 days.",
    date: "2026-01-12T09:30:00Z",
    status: "overdue",
  },
];

export const mockNotifications: UserAlert[] = [
  {
    id: "note-1",
    type: "notification",
    title: "Team Update",
    message: "Your team has added new files to Project C.",
    date: "2026-01-18T14:20:00Z",
    status: "info",
  },
  {
    id: "note-2",
    type: "notification",
    title: "New Project Assigned",
    message: "You’ve been assigned to Project D.",
    date: "2026-01-17T11:45:00Z",
    status: "info",
  },
];

export const mockPayments: UserAlert[] = [
  {
    id: "pay-1",
    type: "payment",
    title: "Invoice #1023",
    message: "Payment of $1,200 received for Project A.",
    date: "2026-01-10T08:00:00Z",
    status: "completed",
  },
  {
    id: "pay-2",
    type: "payment",
    title: "Invoice #1024",
    message: "Payment of $800 pending for Project B.",
    date: "2026-01-14T12:00:00Z",
    status: "pending",
  },
];

export const mockDeadlines: UserAlert[] = [
  {
    id: "deadline-1",
    type: "deadline",
    title: "Project C Submission",
    message: "Deadline for Project C is approaching in 2 days.",
    date: "2026-01-21T23:59:00Z",
    status: "pending",
  },
  {
    id: "deadline-2",
    type: "deadline",
    title: "Project D Review",
    message: "Review meeting scheduled for Project D.",
    date: "2026-01-25T15:00:00Z",
    status: "info",
  },
];

export const userAlerts = {
  alerts: mockAlerts,
  notifications: mockNotifications,
  payments: mockPayments,
  deadlines: mockDeadlines,
};
