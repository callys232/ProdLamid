"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Consultant } from "@/types/client";

interface Props {
  consultants: Consultant[] | string[];
  accent?: string;
}

export default function FreelancerGrowthChart({
  consultants,
  accent = "#2563EB",
}: Props) {
  const data = (consultants || []).map((c, i) => ({
    month: `M${i + 1}`,
    freelancers: i + 1,
  }));

  // Headline metrics
  const totalFreelancers = data.length;
  const growthRate =
    totalFreelancers > 1
      ? `${Math.round(((totalFreelancers - 1) / totalFreelancers) * 100)}%`
      : "N/A";

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Total Freelancers: <span className="text-white">{totalFreelancers}</span></span>
        <span>Growth Rate: <span className="text-white">{growthRate}</span></span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: `1px solid ${accent}`,
              color: "#fff",
            }}
            formatter={(value) => [`${value}`, "Freelancers"]}
            labelFormatter={(label) => `Growth Period: ${label}`}
          />
          <Bar dataKey="freelancers" fill={accent} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
