import { z } from "zod";

/* ── Auth ────────────────────────────────────────────────────── */
export const RegisterSchema = z.object({
  name:          z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email:         z.string().trim().toLowerCase().email("Invalid email address"),
  password:      z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role:          z.enum(["client", "seller"], { error: "Role must be 'client' or 'seller'" }),
  isEnterprise:  z.boolean().optional().default(false),
  companyName:   z.string().trim().max(120).optional(),
});

export const LoginSchema = z.object({
  email:    z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required").max(128),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput    = z.infer<typeof LoginSchema>;

/* ── Projects ────────────────────────────────────────────────── */

// Safe regex: escape user input before using in $regex to prevent ReDoS
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const ProjectQuerySchema = z.object({
  page:     z.coerce.number().int().min(1).max(1000).default(1),
  limit:    z.coerce.number().int().min(1).max(50).default(20),
  search:   z.string().trim().max(100).optional(),
  category: z.string().trim().max(60).optional(),
  status:   z.string().trim().max(30).optional(),
  scope:    z.string().optional(),
  teamId:   z.string().optional(),
  role:     z.enum(["owner", "consultant"]).optional(),
});

/* ── Escrow ──────────────────────────────────────────────────── */
export const EscrowFundSchema = z.object({
  escrowId:       z.string().min(1),
  milestoneId:    z.string().optional(),
  idempotencyKey: z.string().max(128).optional(),
});

export const EscrowReleaseSchema = z.object({
  escrowId: z.string().min(1),
});

/* ── Generic validation helper ───────────────────────────────── */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true;  data: T }
  | { success: false; errors: string[] }
{
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    errors:  result.error.issues.map(i => i.message),
  };
}
