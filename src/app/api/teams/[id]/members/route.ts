import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Team } from "@/lib/models/Team";
import { Users } from "@/lib/models/User";

type Params = Promise<{ id: string }>;

// POST /api/teams/[id]/members - Add a member to a team
export async function POST(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;
        const { email, role } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        // Find user by email
        const userToAdd = await Users.findOne({ email });
        if (!userToAdd) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Check if user is already a member
        const team = await Team.findById(id);
        if (!team) {
            return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
        }

        const isMember = team.members.some((m: any) => m.user.toString() === userToAdd._id.toString());
        if (isMember) {
            return NextResponse.json({ success: false, message: "User is already a member" }, { status: 400 });
        }

        // Add member
        team.members.push({
            user: userToAdd._id,
            role: role || "member",
            addedAt: new Date()
        });

        await team.save();

        const updatedTeam = await Team.findById(id).populate("members.user", "username email profile");

        return NextResponse.json({ success: true, data: updatedTeam });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE /api/teams/[id]/members - Remove a member from a team
export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await connectDB();
        const { id } = await params;
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const team = await Team.findById(id);
        if (!team) {
            return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
        }

        // Remove member
        team.members = team.members.filter((m: any) => m.user.toString() !== userId);
        await team.save();

        const updatedTeam = await Team.findById(id).populate("members.user", "username email profile");

        return NextResponse.json({ success: true, data: updatedTeam });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
