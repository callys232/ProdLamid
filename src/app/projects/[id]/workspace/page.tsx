import ProjectWorkspace from "@/components/projects/workspace/ProjectWorkspace";

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
    await params;
    return <ProjectWorkspace />;
}
