
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { Organization } from "@/lib/models/Organization";
import { OrgMember, DEFAULT_PERMISSIONS } from "@/lib/models/OrgMember";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/mailer";
import { awardPoints, SIGNUP_BONUS } from "@/lib/services/pointsService";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { name, email, password, role, isEnterprise, companyName } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 400 }
            );
        }

        // Validate role
        if (!["client", "seller"].includes(role)) {
            return NextResponse.json(
                { success: false, message: "Invalid role. Must be 'client' or 'seller'." },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate email verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create User
        const user = await Users.create({
            username: name.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000),
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            verificationCode,
        });

        // Send verification email (non-blocking)
        sendVerificationEmail(email, verificationCode).catch(console.error);

        // Create empty Profile for the user
        await Profile.create({
            user: user._id,
            firstName: name.split(" ")[0],
            lastName: name.split(" ").slice(1).join(" ") || "",
            ...(role === "seller" && {
                title: "New Consultant",
                rate: 50,
                rating: 0,
                industry: "General",
                delivery: "Remote",
                skills: []
            })
        });

        // Enterprise org creation
        let orgId: string | undefined;
        let orgRole: string | undefined;

        if (isEnterprise) {
            const orgName = companyName || name;
            const slug = orgName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

            const org = await Organization.create({
                name: orgName,
                slug,
                tier: "enterprise",
                maxMembers: 50,
                ownerId: user._id,
                status: "trial",
            });

            await OrgMember.create({
                orgId: org._id,
                userId: user._id,
                role: "org_admin",
                status: "active",
                joinedAt: new Date(),
                permissions: DEFAULT_PERMISSIONS["org_admin"],
            });

            await Users.findByIdAndUpdate(user._id, {
                orgId: org._id,
                orgRole: "org_admin",
            });

            orgId   = String(org._id);
            orgRole = "org_admin";
        }

        // Award signup bonus points (non-blocking)
        const bonusKey = isEnterprise ? "enterprise" : role;
        const bonus    = SIGNUP_BONUS[bonusKey] ?? SIGNUP_BONUS[role] ?? 0;
        if (bonus > 0) {
            awardPoints(
                String(user._id),
                bonus,
                `Welcome bonus — ${bonusKey} account`,
                "signup_bonus"
            ).catch(console.error);
        }

        // Generate Token
        const token = jwt.sign(
            { userId: user._id, role: user.role, ...(orgId && { orgId, orgRole }) },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return success
        const response = NextResponse.json(
            { success: true, data: { user, token, isEnterprise: !!isEnterprise } },
            { status: 201 }
        );

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
