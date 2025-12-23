// src/components/project/ConsultantsCard.tsx
import Card from "./card";
import type { Consultant } from "@/types/client";

export default function ConsultantsCard({
  consultants,
}: {
  consultants: (string | Consultant)[];
}) {
  return (
    <Card title="👥 Consultants">
      {consultants && consultants.length > 0 ? (
        <ul className="space-y-2">
          {consultants.map((c, idx) => (
            <li key={idx} className="text-sm text-gray-300">
              {typeof c === "string" ? c : `${c.name} — ${c.role}`}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No consultants assigned yet.</p>
      )}
    </Card>
  );
}
