"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Milestone } from "@/types/project";

interface Props {
  milestones: Milestone[];
  accent?: string;
}

export default function CompletionSpeedChart({
  milestones,
  accent = "#2563EB",
}: Props) {
  const data = milestones.map((m) => ({
    name: m.title,
    completion: m.progress ?? (m.status === "completed" ? 100 : 0),
    dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "N/A",
  }));

  // Headline metrics
  const avgCompletion =
    data.length > 0
      ? Math.round(data.reduce((sum, d) => sum + d.completion, 0) / data.length)
      : 0;
  const nextDue = data.find((d) => d.completion < 100)?.dueDate ?? "All complete";

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Average Completion: <span className="text-white">{avgCompletion}%</span></span>
        <span>Next Due: <span className="text-white">{nextDue}</span></span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: `1px solid ${accent}`,
              color: "#fff",
            }}
            formatter={(value) => [`${value}%`, "Completion"]}
            labelFormatter={(label, payload) =>
              `${label} (Due: ${payload[0]?.payload?.dueDate})`
            }
          />
          <Line
            type="monotone"
            dataKey="completion"
            stroke={accent}
            strokeWidth={2}
            dot={{ r: 4, fill: accent }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
