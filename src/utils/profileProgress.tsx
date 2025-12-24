import { ClientProfile } from "@/types/client";

export function computeProfileProgress(client: ClientProfile | null): number {
  if (!client) return 0;

  // 1. Profile fields
  const fieldsToCheck: (keyof ClientProfile)[] = [
    "name",
    "email",
    "companyname",
    "industry",
    "location",
  ];
  const filled = fieldsToCheck.filter((f) => !!client[f]).length;
  const profileScore = filled / fieldsToCheck.length;

  // 2. Projects completion
  const totalProjects = client.projects.length;
  const completedProjects = client.projects.filter(
    (p) => p.status === "completed"
  ).length;
  const projectScore =
    totalProjects > 0 ? completedProjects / totalProjects : 0;

  // 3. Escrow activity
  const totalEscrow = client.escrowTransactions.length;
  const releasedEscrow = client.escrowTransactions.filter(
    (t) => t.status === "released"
  ).length;
  const escrowScore = totalEscrow > 0 ? releasedEscrow / totalEscrow : 0;

  // 4. Consultants & Invitations
  const consultantScore = client.consultants.length > 0 ? 1 : 0;
  const invitationScore = client.invitations.length > 0 ? 1 : 0;

  // Weighted average
  const progress =
    profileScore * 0.35 +
    projectScore * 0.35 +
    escrowScore * 0.15 +
    consultantScore * 0.1 +
    invitationScore * 0.05;

  return Math.round(progress * 100);
}
