
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import "@/lib/models/BusinessProfile";
import "@/lib/models/PaymentInfo";
import "@/lib/models/Address";
import { Users } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { isRevoked } from "@/lib/tokenBlocklist";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export async function GET(request: Request) {
    try {
        // Get token from cookie or header
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("token");
        let token = tokenCookie?.value;

        if (!token) {
            const authHeader = request.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (await isRevoked(token)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Verify token
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        /* ── Dev / demo token short-circuit — no DB touch ── */
        const demoEnabled = process.env.DEMO_MODE !== "false";
        if (decoded.dev === true && demoEnabled) {
            return NextResponse.json({
                success: true,
                data: {
                    _id:                decoded.userId,
                    id:                 decoded.userId,
                    email:              decoded.email              ?? "",
                    username:           decoded.username           ?? "",
                    name:               decoded.name               ?? "Demo User",
                    role:               decoded.role               ?? "client",
                    accountType:        decoded.accountType        ?? "Client",
                    tier:               decoded.tier               ?? "free",
                    isPremium:          decoded.isPremium          ?? false,
                    subscriptionStatus: decoded.subscriptionStatus ?? "inactive",
                    isVerified:         true,
                    status:             "active",
                    profile:            { firstName: decoded.name?.split(" ")[0] ?? "Demo", lastName: decoded.name?.split(" ")[1] ?? "User" },
                },
            });
        }

        await connectDB();

        // Find User
        const user = await Users.findById(decoded.userId)
            .select("-password")
            .populate({ path: "profile", strictPopulate: false })
            .populate({ path: "businessProfile", strictPopulate: false })
            .populate({ path: "paymentInfo", strictPopulate: false })
            .populate({ path: "addresses", strictPopulate: false });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Fetch associated projects
        const { Project } = await import("@/lib/models/Project");
        const projects = await Project.find({
            $or: [
                { ownerId: user._id },
                { consultants: user._id }
            ]
        }).limit(50).lean();

        const userData = user.toJSON();
        userData.projects = projects;
        
        return NextResponse.json({ success: true, data: userData });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Unauthorized: " + error.message },
            { status: 401 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        await connectDB();

        // Get token
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("token");
        let token = tokenCookie?.value;

        if (!token) {
            const authHeader = request.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (await isRevoked(token)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await Users.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const body = await request.json();

        // Split body for different models
        const profileFields  = ["profilePicture", "bio", "firstName", "lastName", "industry", "rate", "delivery", "title", "skills"];
        const businessFields = ["companyName", "companySize", "website", "description", "industry", "location", "employmentHistory"];
        const paymentFields  = ["walletAddress", "network", "bankAccount", "routingNumber", "bankName"];

        const profileData: any = {};
        const businessData: any = {};
        const paymentData: any = {};

        Object.keys(body).forEach(key => {
            if (profileFields.includes(key))  profileData[key]  = body[key];
            if (businessFields.includes(key)) businessData[key] = body[key];
            if (paymentFields.includes(key))  paymentData[key]  = body[key];
        });

        // Update Profile
        if (Object.keys(profileData).length > 0) {
            await (mongoose.models.Profile || Profile).findOneAndUpdate(
                { user: user._id },
                { $set: profileData },
                { new: true, upsert: true }
            );
        }

        // Update Business Profile (employmentHistory replaces the whole array)
        if (Object.keys(businessData).length > 0) {
            const { BusinessProfile } = await import("@/lib/models/BusinessProfile");
            const update: any = { $set: {} };
            Object.keys(businessData).forEach(k => {
                if (k === "employmentHistory") {
                    update.$set.employmentHistory = businessData.employmentHistory;
                } else {
                    update.$set[k] = businessData[k];
                }
            });
            await BusinessProfile.findOneAndUpdate(
                { user: user._id },
                update,
                { new: true, upsert: true }
            );
        }

        // Update Payment Info
        if (Object.keys(paymentData).length > 0) {
            const { PaymentInfo } = await import("@/lib/models/PaymentInfo");
            await PaymentInfo.findOneAndUpdate(
                { user: user._id },
                { $set: paymentData },
                { new: true, upsert: true }
            );
        }

        // Update User (e.g. for twoFAEnabled)
        if (body.twoFAEnabled !== undefined) {
            await Users.findByIdAndUpdate(user._id, { twoFAEnabled: body.twoFAEnabled });
        }

        // Return updated user with everything populated
        const updatedUser = await Users.findById(user._id)
            .select("-password")
            .populate({ path: "profile", strictPopulate: false })
            .populate({ path: "businessProfile", strictPopulate: false })
            .populate({ path: "paymentInfo", strictPopulate: false })
            .populate({ path: "addresses", strictPopulate: false });

        const userData = updatedUser.toJSON();
        return NextResponse.json({ success: true, data: userData });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
