import { NextResponse } from "next/server";
import { estimateProjectDetails } from "@/lib/openai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, category, skills } = body;

        if (!title || !category) {
            return NextResponse.json(
                { error: "Title and category are required" },
                { status: 400 }
            );
        }

        const estimation = await estimateProjectDetails({
            title,
            description,
            category,
            skills,
        });

        return NextResponse.json(estimation);
    } catch (error: any) {
        console.error("API Estimation Error:", error);
        return NextResponse.json(
            { error: "Failed to estimate project details" },
            { status: 500 }
        );
    }
}
