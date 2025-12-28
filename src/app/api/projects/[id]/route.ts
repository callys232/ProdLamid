
import { NextResponse } from "next/server";
import { teamProjects, individualProjects } from "@/mocks/mockClient";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const allProjects = [...teamProjects, ...individualProjects];
    const project = allProjects.find((p) => p.id === id || p._id === id);

    if (!project) {
        return NextResponse.json(
            { error: "Project not found" },
            { status: 404 }
        );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(project);
}
