"use client";

interface Props {
  name: string;
  projectCount: number;
  teamCount: number;
}

export default function TeamHeader({ name, projectCount, teamCount }: Props) {
  return (
    <div className="px-4 py-3 border-b flex items-center justify-between">
      <h2 className="text-xl font-semibold">{name} Team</h2>

      <div className="flex gap-6 text-sm text-gray-500">
        <p>
          Projects: <span className="font-semibold">{projectCount}</span>
        </p>
        <p>
          Members: <span className="font-semibold">{teamCount}</span>
        </p>
      </div>
    </div>
  );
}
