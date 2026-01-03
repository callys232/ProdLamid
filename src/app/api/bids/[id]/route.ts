
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Bid } from "@/lib/models/Bid";

// GET single bid
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        const bid = await Bid.findById(id);

        if (!bid) {
            return NextResponse.json(
                { success: false, message: "Bid not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: bid });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// PUT update bid (e.g. status change)
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;
        const body = await request.json();

        const bid = await Bid.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!bid) {
            return NextResponse.json(
                { success: false, message: "Bid not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: bid });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE bid
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        const bid = await Bid.findByIdAndDelete(id);

        if (!bid) {
            return NextResponse.json(
                { success: false, message: "Bid not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
