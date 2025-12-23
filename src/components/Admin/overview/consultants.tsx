"use client";
import React from "react";
import { Consultant } from "@/types/client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  consultants?: Consultant[];
}

// Mock data with numeric rate values
const mockConsultants: Consultant[] = [
  {
    id: "c1",
    name: "Jane Doe",
    industry: "Tech",
    delivery: "Remote",
    rate: 50,
    rating: 4.5,
    role: "Developer",
  },
  {
    id: "c2",
    name: "John Smith",
    industry: "Finance",
    delivery: "Onsite",
    rate: 70,
    rating: 3.8,
    role: "Analyst",
  },
  {
    id: "c3",
    name: "Mary Johnson",
    industry: "Design",
    delivery: "Remote",
    rate: 60,
    rating: 4.2,
    role: "Designer",
  },
];

export default function ConsultantStats({
  consultants = mockConsultants,
}: Props) {
  const total = consultants.length;
  const avgRating = Number(
    (consultants.reduce((sum, c) => sum + c.rating, 0) / total).toFixed(1)
  );

  const ratingData = consultants.map((c) => ({
    name: c.name,
    rating: c.rating,
  }));

  return (
    <div
      className="bg-[#0f0f0f]/70 backdrop-blur-md border border-[#1f1f1f] rounded-lg p-6 
                 shadow-lg transition-transform duration-300 
                 hover:scale-105 hover:shadow-[0_0_25px_#c21229]"
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        👥 Consultants & Freelancers
      </h3>
      <p className="text-sm text-gray-300">
        Total: <span className="font-bold text-[#c21229]">{total}</span>
      </p>
      <p className="text-sm text-gray-300">
        Average Rating: <span className="font-bold">{avgRating} ⭐</span>
      </p>

      {/* Ratings Bar Chart */}
      <div className="h-48 mt-4">
        <ResponsiveContainer>
          <BarChart data={ratingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" angle={-30} textAnchor="end" />
            <YAxis stroke="#888" />
            <Tooltip formatter={(value) => `${value} ⭐`} />
            <Bar dataKey="rating" fill="#c21229" name="Rating" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
