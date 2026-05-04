"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star, MapPin, Briefcase, Globe, Check,
  MessageSquare, DollarSign, ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ProfileData {
  _id:      string;
  username: string;
  isPremium?: boolean;
  joinedAt?: string;
  profile?: {
    firstName?:      string;
    lastName?:       string;
    bio?:            string;
    profilePicture?: string;
    title?:          string;
    industry?:       string;
    rate?:           number;
    rating?:         number;
    skills?:         string[];
    delivery?:       string;
  };
}

const card = "rounded-xl border border-white/10 bg-white/5 p-5";

export default function ConsultantPublicProfile({ consultantId }: { consultantId: string }) {
  const [data, setData]     = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/consultants/${consultantId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d.data);
        else setError("Consultant not found");
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [consultantId]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c12129] border-t-transparent" />
    </div>
  );

  if (error || !data) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
      <p className="text-gray-400">{error ?? "Consultant not found"}</p>
      <Link href="/talent" className="text-sm text-[#c12129] hover:underline">← Browse consultants</Link>
    </div>
  );

  const p    = data.profile ?? {};
  const name = p.firstName ? `${p.firstName} ${p.lastName ?? ""}`.trim() : data.username;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">

        {/* Back */}
        <Link href="/talent" className="mb-8 flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Browse consultants
        </Link>

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Avatar */}
            {p.profilePicture ? (
              <img src={p.profilePicture} alt={name}
                className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-[#c12129]/20 text-2xl font-black text-[#c12129]">
                {initials}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{name}</h1>
                {data.isPremium && (
                  <span className="rounded-full border border-[#c12129]/40 bg-[#c12129]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#c12129]">
                    Premium
                  </span>
                )}
              </div>

              {p.title && <p className="text-sm text-gray-400 mb-2">{p.title}</p>}

              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                {p.industry  && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{p.industry}</span>}
                {p.delivery  && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.delivery}</span>}
                {p.rating    && (
                  <span className="flex items-center gap-1 text-white font-semibold">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />{p.rating.toFixed(1)}
                  </span>
                )}
                {p.rate      && <span className="flex items-center gap-1 text-green-400 font-semibold"><DollarSign className="h-3 w-3" />${p.rate}/hr</span>}
              </div>
            </div>

            {/* CTA */}
            <Link href={`/postjobs?consultant=${consultantId}`}
              className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-[#c12129] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
              <MessageSquare className="h-4 w-4" /> Hire {p.firstName ?? "Consultant"}
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-5 lg:col-span-2">
            {p.bio && (
              <div className={card}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">About</h2>
                <p className="text-sm text-gray-300 leading-relaxed">{p.bio}</p>
              </div>
            )}

            {p.skills && p.skills.length > 0 && (
              <div className={card}>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {p.skills.map(s => (
                    <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 transition hover:border-[#c12129]/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div className={card}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Details</h2>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Rate",     value: p.rate     ? `$${p.rate}/hr`       : null },
                  { label: "Delivery", value: p.delivery ?? null },
                  { label: "Industry", value: p.industry ?? null },
                  { label: "Rating",   value: p.rating   ? `★ ${p.rating.toFixed(1)}` : null },
                  { label: "Joined",   value: data.joinedAt ? new Date(data.joinedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : null },
                ].filter(r => r.value).map(r => (
                  <li key={r.label} className="flex justify-between">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="font-medium text-white">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.div whileHover={{ y: -2 }}>
              <Link href={`/postjobs?consultant=${consultantId}`}
                className="block w-full rounded-xl bg-[#c12129] py-3 text-center text-sm font-bold text-white transition hover:bg-red-700">
                Post a Project for {p.firstName ?? "this Consultant"}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
