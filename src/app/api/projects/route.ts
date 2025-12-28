
import { NextResponse } from "next/server";
import { teamProjects, individualProjects } from "@/mocks/mockClient";

export async function GET() {
    const allProjects = [...teamProjects, ...individualProjects];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(allProjects);
}
