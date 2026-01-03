
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const category = searchParams.get("category");

        const query: any = {};
        if (type) query.type = type;
        if (category) query.category = category;

        const events = await Event.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: events });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const event = await Event.create(body);

        return NextResponse.json({ success: true, data: event }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
