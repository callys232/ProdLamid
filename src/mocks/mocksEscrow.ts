import type { Escrow } from "@/types/escrow";

export const mockEscrow: Escrow = {
  id: "escrow_001",
  balance: 3800,
  status: "in_progress",
  teamNumber: "Team 7",
  amountPaid: 1200,
  projectFund: 5000,
  projectDuration: "3 months",
  milestone: "UI Integration", // optional single milestone label
  milestones: [
    {
      id: "m1",
      title: "UI Integration",
      progress: 50,
      status: "in_progress",
    },
    {
      id: "m2",
      title: "Backend API",
      progress: 0,
      status: "pending",
    },
    {
      id: "m3",
      title: "Testing & QA",
      progress: 100,
      status: "completed",
    },
    {
      id: "m4",
      title: "Deployment",
      progress: 20,
      status: "disputed",
    },
  ],
  messages: [
    {
      id: "msg1",
      sender: "client",
      content: "Can we review milestone 1?",
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      balance: 3800,
    },
    {
      id: "msg2",
      sender: "consultant",
      content: "Sure, I’ll prepare the draft.",
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      balance: 3800,
    },
    {
      id: "msg3",
      sender: "admin",
      content: "Reminder: project deadline in 2 weeks.",
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      balance: 3800,
    },
  ],
};
