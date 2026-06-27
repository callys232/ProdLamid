// mocks/mockEnterpriseMembers.ts
import type { OrgMember } from "@/types/enterprise";

export const mockEnterpriseMembers: OrgMember[] = [
  {
    _id: "m1", orgId: "", userId: "u1", role: "org_admin",   status: "active",
    joinedAt: "2026-01-10", permissions: {} as any, createdAt: "", updatedAt: "",
    user: { _id: "u1", username: "alex_ceo",  email: "alex@acme.com",  role: "client" },
  },
  {
    _id: "m2", orgId: "", userId: "u2", role: "org_manager", status: "active",
    joinedAt: "2026-02-01", permissions: {} as any, createdAt: "", updatedAt: "",
    user: { _id: "u2", username: "sarah_ops", email: "sarah@acme.com", role: "client" },
  },
  {
    _id: "m3", orgId: "", userId: "u3", role: "org_member",  status: "active",
    joinedAt: "2026-02-15", permissions: {} as any, createdAt: "", updatedAt: "",
    user: { _id: "u3", username: "james_fin", email: "james@acme.com", role: "client" },
  },
  {
    _id: "m4", orgId: "", userId: undefined, role: "org_member", status: "pending",
    joinedAt: undefined, permissions: {} as any, createdAt: "", updatedAt: "",
    inviteEmail: "priya@acme.com",
  },
];
