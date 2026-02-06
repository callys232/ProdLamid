import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Wallet } from "@/lib/models/Wallet";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, message: "UserId is required" }, { status: 400 });
        }

        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            return NextResponse.json({ success: true, data: [] });
        }

        // Sort transactions by date descending
        const transactions = (wallet.transactions || []).sort((a: any, b: any) =>
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );

        return NextResponse.json({ success: true, data: transactions });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
