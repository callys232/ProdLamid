import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { Organization } from "@/lib/models/Organization";
import { OrgMember, DEFAULT_PERMISSIONS } from "@/lib/models/OrgMember";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/mailer";
import { awardPoints, SIGNUP_BONUS } from "@/lib/services/pointsService";
import { rateLimit } from "@/lib/rateLimit";
import { RegisterSchema, validate } from "@/lib/validation/schemas";
import { verifyTurnstile } from "@/lib/turnstile";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");

export async function POST(request: NextRequest) {
    try {
        // ── Rate limit: 5 registrations per 15 min per IP ───────────────
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const rl = await rateLimit(`register:${ip}`, { windowMs: 15 * 60_000, max: 5 });
        if (!rl.allowed) {
            return NextResponse.json(
                { success: false, message: "Too many registration attempts. Try again later." },
                { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
            );
        }

        // ── Validate input with Zod ──────────────────────────────────────
        const body = await request.json().catch(() => ({}));

        // ── CAPTCHA verification ──────────────────────────────────────
        const captchaOk = await verifyTurnstile(body?.captchaToken, ip);
        if (!captchaOk) {
            return NextResponse.json(
                { success: false, message: "CAPTCHA verification failed. Please try again." },
                { status: 400 }
            );
        }

        const validation = validate(RegisterSchema, body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: "Validation failed", errors: validation.errors },
                { status: 400 }
            );
        }

        const { name, email, password, role, isEnterprise, companyName } = validation.data;

        await connectDB();

        // ── Duplicate check ──────────────────────────────────────────────
        const existingUser = await Users.findOne({ email }).lean();
        if (existingUser) {
            // Same response regardless of whether user exists — prevents enumeration
            return NextResponse.json(
                { success: false, message: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // ── Hash password + verification code ────────────────────────────
        const hashedPassword  = await bcrypt.hash(password, 12);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // ── Create user ──────────────────────────────────────────────────
        const user = await Users.create({
            username:         name.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000),
            email,
            password:         hashedPassword,
            role,
            isVerified:       false,
            verificationCode,
        });

        // ── Profile (non-blocking if it fails, user account still created) ──
        Profile.create({
            user:      user._id,
            firstName: name.split(" ")[0],
            lastName:  name.split(" ").slice(1).join(" ") || "",
            ...(role === "seller" && {
                title:    "New Consultant",
                rate:     50,
                rating:   0,
                industry: "General",
                delivery: "Remote",
                skills:   [],
            }),
        }).catch(console.error);

        // ── Verification email (non-blocking) ────────────────────────────
        sendVerificationEmail(email, verificationCode).catch(console.error);

        // ── Enterprise org setup ─────────────────────────────────────────
        let orgId: string | undefined;
        let orgRole: string | undefined;

        if (isEnterprise) {
            try {
                const orgName = companyName || name;
                const slug    = orgName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

                const org = await Organization.create({
                    name: orgName, slug,
                    tier: "enterprise", maxMembers: 50,
                    ownerId: user._id, status: "trial",
                });

                await OrgMember.create({
                    orgId: org._id, userId: user._id,
                    role: "org_admin", status: "active",
                    joinedAt: new Date(),
                    permissions: DEFAULT_PERMISSIONS["org_admin"],
                });

                await Users.findByIdAndUpdate(user._id, {
                    orgId: org._id, orgRole: "org_admin", accountType: "Enterprise",
                });

                orgId   = String(org._id);
                orgRole = "org_admin";
            } catch (orgErr) {
                console.error("[register] Enterprise org creation failed:", orgErr);
                // Continue — user account is created; org can be retried
            }
        }

        // ── Signup bonus (non-blocking) ──────────────────────────────────
        const bonusKey = isEnterprise ? "enterprise" : role;
        const bonus    = SIGNUP_BONUS[bonusKey as keyof typeof SIGNUP_BONUS] ?? SIGNUP_BONUS[role as keyof typeof SIGNUP_BONUS] ?? 0;
        if (bonus > 0) {
            awardPoints(String(user._id), bonus, `Welcome bonus — ${bonusKey} account`, "signup_bonus")
                .catch(console.error);
        }

        // ── Issue token ──────────────────────────────────────────────────
        const token = jwt.sign(
            { userId: user._id, role: user.role, ...(orgId && { orgId, orgRole }) },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ── Sanitise — never return password or internal fields ──────────
        const { password: _pw, verificationCode: _vc, ...safeUser } = (user as any).toObject?.() ?? user;

        const response = NextResponse.json(
            { success: true, data: { user: safeUser, token, isEnterprise: !!isEnterprise } },
            { status: 201 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:   7 * 24 * 60 * 60,
            path:     "/",
        });

        return response;

    } catch (error: any) {
        console.error("[register]", error);
        return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
    }
}
