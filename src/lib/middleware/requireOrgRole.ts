import type { AuthResult } from "./auth";
import type { OrgRole } from "@/types/enterprise";

export function requireOrgRole(auth: AuthResult, allowed: OrgRole[]): boolean {
  return !!auth.orgRole && allowed.includes(auth.orgRole as OrgRole);
}
