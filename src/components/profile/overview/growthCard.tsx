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
  accent = "#c12129",
}: Props) {
  const data = (consultants || []).map((c, i) => ({
    month: `M${i + 1}`,
    freelancers: i + 1,
  }));

  return (
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
  );
}
