import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, DollarSign, Tag, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function getProject(id: string) {
  const base = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
  const res  = await fetch(`${base}/api/projects/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const p = await getProject(id);
  if (!p) return { title: "Project — Lamid" };
  return {
    title:       `${p.title} — Lamid`,
    description: p.description?.slice(0, 160) ?? `View project details on Lamid.`,
    openGraph:   { title: p.title, description: p.description?.slice(0, 160) },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const p = await getProject(id);

  // Authenticated workspace redirect handled client-side; server shows public view
  if (!p) notFound();

  const isOpen = p.status === "open";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">

        {/* Back */}
        <Link href="/jobs" className="mb-8 flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition">
          ← Browse projects
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-7">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className={`mb-2 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                isOpen ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-gray-500/30 bg-gray-500/10 text-gray-400"
              }`}>{p.status}</span>
              <h1 className="text-2xl font-bold text-white">{p.title}</h1>
              {p.category && <p className="mt-1 text-sm text-gray-400">{p.category}</p>}
            </div>
            {isOpen && (
              <Link href={`/postjobs?apply=${id}`}
                className="flex items-center gap-2 rounded-xl bg-[#c12129] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-gray-500">
            {p.budget    && <span className="flex items-center gap-1.5 text-green-400 font-semibold"><DollarSign className="h-3.5 w-3.5" />${p.budget.toLocaleString()}</span>}
            {p.hourlyRate && <span className="flex items-center gap-1.5 text-blue-400 font-semibold"><DollarSign className="h-3.5 w-3.5" />${p.hourlyRate}/hr</span>}
            {p.location  && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{p.location}</span>}
            {p.deadline  && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Deadline: {p.deadline}</span>}
            {p.priority  && <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" />{p.priority} priority</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {p.description && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">Description</h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{p.description}</p>
              </div>
            )}
            {p.skills?.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((s: string) => (
                    <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {isOpen && (
              <div className="rounded-xl border border-[#c12129]/20 bg-[#c12129]/5 p-5 text-center">
                <p className="mb-3 text-sm font-semibold text-white">Interested in this project?</p>
                <Link href={`/signup`}
                  className="block w-full rounded-xl bg-[#c12129] py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
                  Sign up &amp; Apply
                </Link>
                <p className="mt-2 text-[11px] text-gray-600">Already have an account? <Link href={`/signin`} className="text-[#c12129] hover:underline">Sign in</Link></p>
              </div>
            )}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">Details</h2>
              <ul className="space-y-2 text-xs">
                {[
                  { label: "Category",  value: p.category },
                  { label: "Budget",    value: p.budget    ? `$${p.budget.toLocaleString()}`    : null },
                  { label: "Hourly",    value: p.hourlyRate ? `$${p.hourlyRate}/hr`              : null },
                  { label: "Location",  value: p.location },
                  { label: "Deadline",  value: p.deadline },
                  { label: "Priority",  value: p.priority },
                  { label: "Status",    value: p.status },
                ].filter(r => r.value).map(r => (
                  <li key={r.label} className="flex justify-between gap-3">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="text-right font-medium text-white capitalize">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
