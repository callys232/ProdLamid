// src/components/project/MilestonesCard.tsx
import Card from "./card";
import type { Milestone } from "@/types/project";

export default function MilestonesCard({
  milestones,
}: {
  milestones: Milestone[];
}) {
  return (
    <Card title="⏳ Milestones">
      <ul className="space-y-3">
        {milestones.map((m) => (
          <li
            key={m.id}
            className="bg-[#0c0000] p-4 rounded-md border border-[#3a1919]"
          >
            <p className="font-semibold">{m.title}</p>
            <p className="text-sm text-gray-400">{m.description}</p>
            <p className="text-sm text-gray-300">Status: {m.status}</p>
            <p className="text-sm text-gray-300">Progress: {m.progress}%</p>
            {m.deadline && (
              <p className="text-sm text-gray-300">Due: {m.deadline}</p>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
