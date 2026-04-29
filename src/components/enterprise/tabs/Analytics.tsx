"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const SPEND_DATA = [
  { month: "Nov", spend: 42000 },
  { month: "Dec", spend: 67000 },
  { month: "Jan", spend: 53000 },
  { month: "Feb", spend: 89000 },
  { month: "Mar", spend: 74000 },
  { month: "Apr", spend: 95000 },
];

const CATEGORY_DATA = [
  { category: "Tech",      count: 8 },
  { category: "Finance",   count: 5 },
  { category: "Design",    count: 4 },
  { category: "Marketing", count: 6 },
  { category: "Legal",     count: 3 },
  { category: "Data",      count: 7 },
];

const CONSULTANTS = [
  { name: "Amara Nwosu",    projects: 4, rating: 4.9, paid: 88000 },
  { name: "James Thornton", projects: 3, rating: 4.8, paid: 54000 },
  { name: "Priya Sharma",   projects: 2, rating: 5.0, paid: 42000 },
  { name: "Dele Okafor",    projects: 5, rating: 4.7, paid: 110000 },
];

const card = "rounded-xl border border-white/10 bg-white/5 p-5";

const TOOLTIP_STYLE = {
  contentStyle: { background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 12 },
  cursor: { fill: "rgba(193,33,41,0.05)" },
};

export default function Analytics() {
  return (
    <div className="space-y-6 p-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Spend",     value: "$420K",  sub: "last 6 months" },
          { label: "Avg Project",     value: "$28K",   sub: "per engagement" },
          { label: "Completion Rate", value: "94%",    sub: "milestones hit" },
          { label: "Avg Duration",    value: "3.4 mo", sub: "per project" },
        ].map(({ label, value, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#c12129]/20"
          >
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value}</p>
            <p className="text-[11px] text-gray-600">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spend line chart */}
        <div className={card}>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400">Monthly Spend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SPEND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`$${v.toLocaleString()}`, "Spend"]} />
              <Line type="monotone" dataKey="spend" stroke="#c12129" strokeWidth={2.5} dot={{ fill: "#c12129", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar chart */}
        <div className={card}>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400">Projects by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CATEGORY_DATA}>
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
              {CONSULTANTS.map((c, i) => (
                <motion.tr
                  key={c.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="transition hover:bg-white/5"
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
