"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  mockSpendData, mockCategoryData, mockConsultantPerf, mockAnalyticsKPIs,
  type SpendDataPoint, type CategoryDataPoint, type ConsultantPerf,
} from "@/mocks/mockEnterpriseAnalytics";

interface AnalyticsData {
  kpis:        { totalSpend: number; avgProject: number; completionRate: number; avgDuration: number };
  spendData:   SpendDataPoint[];
  categoryData: CategoryDataPoint[];
  consultants: ConsultantPerf[];
}

const card = "rounded-xl border border-white/10 bg-white/5 p-5";

const TOOLTIP_STYLE = {
  contentStyle: { background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 12 },
  cursor: { fill: "rgba(193,33,41,0.05)" },
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    kpis:         mockAnalyticsKPIs,
    spendData:    mockSpendData,
    categoryData: mockCategoryData,
    consultants:  mockConsultantPerf,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enterprise/analytics")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.data) setData(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const { kpis, spendData, categoryData, consultants } = data;

  const KPI_CARDS = [
    { label: "Total Spend",     value: `$${(kpis.totalSpend / 1000).toFixed(0)}K`,  sub: "last 6 months"  },
    { label: "Avg Project",     value: `$${(kpis.avgProject / 1000).toFixed(0)}K`,  sub: "per engagement" },
    { label: "Completion Rate", value: `${kpis.completionRate}%`,                   sub: "milestones hit" },
    { label: "Avg Duration",    value: `${kpis.avgDuration} mo`,                    sub: "per project"    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#c12129] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {KPI_CARDS.map(({ label, value, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3, scale: 1.04, boxShadow: "0 10px 28px rgba(0,0,0,0.35)" }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition"
          >
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value}</p>
            <p className="text-[11px] text-gray-600">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Spend line chart */}
        <div className={card}>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400">Monthly Spend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={spendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`$${(Number(v)).toLocaleString()}`, "Spend"]} />
              <Line type="monotone" dataKey="spend" stroke="#c12129" strokeWidth={2.5} dot={{ fill: "#c12129", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar chart */}
        <div className={card}>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400">Projects by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#c12129" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consultant performance table */}
      <div className={card}>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Consultant Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-gray-500">
                <th className="pb-3 text-left font-medium">Consultant</th>
                <th className="pb-3 text-center font-medium">Projects</th>
                <th className="pb-3 text-center font-medium">Rating</th>
                <th className="pb-3 text-right font-medium">Total Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {consultants.map((c, i) => (
                <motion.tr
                  key={c.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="transition"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c12129]/10 text-xs font-bold text-[#c12129]">
                        {c.name[0]}
                      </div>
                      <span className="font-medium text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-center text-gray-400">{c.projects}</td>
                  <td className="py-3 text-center font-semibold text-white">★ {c.rating}</td>
                  <td className="py-3 text-right font-semibold text-green-400">${c.paid.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
