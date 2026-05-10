"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Project, Milestone, WorkPhase, Bid } from "@/types/project";
import {
  MapPin, Star, Briefcase, CalendarClock, CheckCircle2,
  X, ArrowRight, Clock, DollarSign, Target, Layers,
  ChevronRight, AlertCircle, CheckCheck, Circle,
} from "lucide-react";

import dynamic from "next/dynamic";

const ApplyModal = dynamic(() => import("./applyModal"), { ssr: false });

interface JobModalProps {
  job: Project;
  isRegisteredUser?: boolean;
  onClose: () => void;
  onApply: (job: Project) => void;
  onBid: (job: Project, amount: number) => void;
  bids?: Bid[];
}

const spring = { type: "spring", stiffness: 400, damping: 22 } as const;

/* ── Status config ───────────────────────────────────────────────── */
const MILESTONE_STATUS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:     { label: "Pending",     color: "bg-gray-500/20 text-gray-400",   icon: <Circle className="h-3 w-3" /> },
  in_progress: { label: "In Progress", color: "bg-yellow-500/20 text-yellow-400", icon: <Clock className="h-3 w-3" /> },
  funded:      { label: "Funded",      color: "bg-blue-500/20 text-blue-400",    icon: <DollarSign className="h-3 w-3" /> },
  completed:   { label: "Completed",   color: "bg-green-500/20 text-green-400",  icon: <CheckCheck className="h-3 w-3" /> },
  disputed:    { label: "Disputed",    color: "bg-red-500/20 text-red-400",      icon: <AlertCircle className="h-3 w-3" /> },
  released:    { label: "Released",    color: "bg-emerald-500/20 text-emerald-400", icon: <CheckCircle2 className="h-3 w-3" /> },
};

function getMilestoneStatus(status?: string) {
  return MILESTONE_STATUS[status ?? ""] ?? { label: status ?? "—", color: "bg-gray-500/20 text-gray-400", icon: <Circle className="h-3 w-3" /> };
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function fmt(v?: number | null, currency = "$") {
  return v != null ? `${currency}${Number(v).toLocaleString()}` : null;
}

function fmtDate(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ── Component ───────────────────────────────────────────────────── */
export default function JobModal({
  job,
  isRegisteredUser = false,
  onClose,
  onApply,
  onBid,
  bids = [],
}: JobModalProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageDir, setImageDir] = useState(1);
  const [bidList, setBidList] = useState(bids);
  const [bidAmount, setBidAmount] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [bidFocus, setBidFocus] = useState(false);

  const [timeLeft, setTimeLeft] = useState("");
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const cur = job.currency ?? "$";

  /* milestones — direct or nested in execution */
  const milestones: Milestone[] = (job.milestones ?? job.execution?.milestones ?? []) as Milestone[];
  const phases: WorkPhase[]     = (job.execution?.workPhases ?? []) as WorkPhase[];

  useEffect(() => {
    if (!job.deadline) { setTimeout(() => setTimeLeft("No deadline"), 0); return; }
    const end = new Date(job.deadline).getTime();
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) { setTimeLeft("Expired"); setDeadlinePassed(true); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setIsUrgent(d < 1);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [job.deadline]);

  const images = (Array.isArray(job.images) ? job.images : [job.image]).filter(Boolean) as string[];

  function changeImage(dir: number) {
    setImageDir(dir);
    setCurrentImage((p) => (p + dir + images.length) % images.length);
  }

  const handleBidSubmit = () => {
    if (!bidAmount || deadlinePassed) return;
    setBidList((prev) => [{ amount: Number(bidAmount), boosted: false, date: new Date().toISOString() }, ...prev]);
    onBid(job, Number(bidAmount));
    setBidAmount("");
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 text-gray-100"
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ ...spring, duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Close ── */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={spring}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </motion.button>

          {/* ── Image Carousel ── */}
          {images.length > 0 && (
            <div className="relative mb-8 h-80 w-full overflow-hidden rounded-2xl shadow-xl">
              <AnimatePresence initial={false} custom={imageDir}>
                <motion.div
                  key={currentImage} custom={imageDir}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit:  (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                  }}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image src={images[currentImage]} alt={job.title} fill className="object-cover" />
                </motion.div>
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  {([-1, 1] as const).map((dir) => (
                    <motion.button key={dir} onClick={() => changeImage(dir)}
                      whileHover={{ scale: 1.1, x: dir === -1 ? -2 : 2 }} whileTap={{ scale: 0.92 }} transition={spring}
                      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-white hover:bg-black/75 ${dir === -1 ? "left-4" : "right-4"}`}
                    >{dir === -1 ? "‹" : "›"}</motion.button>
                  ))}
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {images.map((_, i) => (
                      <motion.button key={i}
                        onClick={() => { setImageDir(i > currentImage ? 1 : -1); setCurrentImage(i); }}
                        animate={{ width: i === currentImage ? 16 : 6, backgroundColor: i === currentImage ? "#c21219" : "rgba(255,255,255,0.4)" }}
                        transition={spring} className="h-1.5 rounded-full"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Header ── */}
          <motion.h2 className="mb-2 text-4xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            {job.title}
          </motion.h2>
          <p className="mb-1 text-sm text-gray-300">
            {job.organization}{job.location && ` — ${job.location}`}
          </p>
          <p className="mb-4 text-sm text-gray-400">
            {job.category}{job.tech && ` | ${job.tech}`}
          </p>

          {/* Badges row */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {job.type && (
              <motion.span whileHover={{ scale: 1.05 }} transition={spring}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">
                {job.type}
              </motion.span>
            )}
            {job.status && (
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold capitalize text-gray-300">
                {job.status}
              </span>
            )}
            {job.deadline && (
              <motion.div
                animate={isUrgent && !deadlinePassed ? { scale: [1, 1.025, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${deadlinePassed ? "bg-red-700 text-white" : "border border-white/20 bg-white/10 text-gray-200"}`}
              >
                <CalendarClock className={`h-4 w-4 ${isUrgent && !deadlinePassed ? "text-red-400" : ""}`} />
                <span>Time Left:</span>
                <span className={isUrgent && !deadlinePassed ? "text-red-400 font-bold" : "text-white"}>{timeLeft}</span>
              </motion.div>
            )}
          </div>

          {/* ── Metrics ── */}
          <div className="mb-8 flex flex-wrap gap-4">
            {[
              job.budget      && { label: "Budget",      value: `${cur}${Number(job.budget).toLocaleString()}`,          icon: <DollarSign className="h-4 w-4" /> },
              job.hourlyRate  && { label: "Hourly Rate",  value: `${cur}${Number(job.hourlyRate).toLocaleString()}/hr`,   icon: <Clock className="h-4 w-4" /> },
              job.priority    && { label: "Priority",     value: job.priority,                                             icon: <Target className="h-4 w-4" /> },
              job.suggestedBidRange && {
                label: "Suggested Bid",
                value: `${cur}${job.suggestedBidRange.min.toLocaleString()} – ${cur}${job.suggestedBidRange.max.toLocaleString()}`,
                icon: <ChevronRight className="h-4 w-4" />,
              },
              job.timeline    && { label: "Timeline",     value: job.timeline,                                             icon: <CalendarClock className="h-4 w-4" /> },
              job.startDate   && { label: "Start Date",   value: fmtDate(job.startDate)!,                                 icon: <CalendarClock className="h-4 w-4" /> },
              job.endDate     && { label: "End Date",     value: fmtDate(job.endDate)!,                                   icon: <CalendarClock className="h-4 w-4" /> },
            ].filter(Boolean).map((m: any, i) => (
              <motion.div key={m.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i * 0.05 }}
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(194,18,25,0.25)" }}
                className="flex items-start gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-4 shadow-md cursor-default"
              >
                <span className="mt-0.5 text-[#c21219]">{m.icon}</span>
                <div>
                  <p className="text-base font-semibold text-white">{m.value}</p>
                  <p className="text-xs text-gray-400">{m.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Description ── */}
          {job.description && (
            <Section title="Description">
              <p className="leading-relaxed text-gray-300 whitespace-pre-line">{job.description}</p>
            </Section>
          )}

          {/* ── Purpose ── */}
          {job.purpose && (
            <Section title="Project Purpose">
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  <Briefcase className="h-3 w-3" /> Why they&apos;re hiring
                </div>
                <p className="text-sm leading-relaxed text-gray-300">{job.purpose}</p>
              </div>
            </Section>
          )}

          {/* ── Skills ── */}
          {job.skills && job.skills.length > 0 && (
            <Section title="Required Skills">
              <motion.div className="flex flex-wrap gap-2"
                variants={{ show: { transition: { staggerChildren: 0.04 } } }} initial="hidden" animate="show">
                {job.skills.map((skill) => (
                  <motion.span key={skill}
                    variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(185,28,28,0.35)" }} transition={spring}
                    className="cursor-default rounded-full bg-red-900/30 px-3 py-1 text-xs font-semibold text-red-400">
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </Section>
          )}

          {/* ── Tags ── */}
          {job.tags && job.tags.length > 0 && (
            <Section title="Tags">
              <motion.div className="flex flex-wrap gap-2"
                variants={{ show: { transition: { staggerChildren: 0.03 } } }} initial="hidden" animate="show">
                {job.tags.map((tag) => (
                  <motion.span key={tag}
                    variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } }}
                    whileHover={{ scale: 1.08, borderColor: "rgba(255,255,255,0.3)" }} transition={spring}
                    className="cursor-default rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </Section>
          )}

          {/* ── Work Phases ── */}
          {phases.length > 0 && (
            <Section title="Work Phases">
              <div className="space-y-2">
                {phases.map((phase, idx) => (
                  <motion.div key={phase.id ?? phase.name}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: idx * 0.06 }}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-600/20 text-xs font-bold text-red-400">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{phase.name}</p>
                      {phase.description && <p className="mt-0.5 text-xs text-gray-400">{phase.description}</p>}
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                        {phase.duration && <span><Clock className="mr-1 inline h-3 w-3" />{phase.duration}</span>}
                        {phase.status   && <span className="capitalize">{phase.status}</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Milestones ── */}
          {milestones.length > 0 && (
            <Section title={`Project Milestones (${milestones.length})`}>
              <div className="space-y-3">
                {milestones.map((ms, idx) => {
                  const st = getMilestoneStatus(ms.status);
                  const linkedPhase = phases.find((p) => p.id === ms.workPhaseId);
                  return (
                    <motion.div key={ms.id ?? ms.title}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: idx * 0.05 }}
                      whileHover={{ borderColor: "rgba(194,18,25,0.35)" }}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-gray-400">
                            {idx + 1}
                          </span>
                          <p className="font-semibold text-white truncate">{ms.title}</p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-2">
                          {ms.amount != null && (
                            <span className="rounded-full bg-green-600/20 px-2.5 py-0.5 text-xs font-bold text-green-400">
                              {fmt(ms.amount, cur)}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${st.color}`}>
                            {st.icon} {st.label}
                          </span>
                        </div>
                      </div>

                      {ms.description && (
                        <p className="mb-2 text-xs text-gray-400 leading-relaxed">{ms.description}</p>
                      )}

                      {/* Progress bar */}
                      {ms.progress != null && (
                        <div className="mb-2">
                          <div className="flex justify-between mb-1 text-[10px] text-gray-500">
                            <span>Progress</span>
                            <span>{ms.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="h-full rounded-full bg-[#c21219]"
                              initial={{ width: 0 }}
                              animate={{ width: `${ms.progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.08 }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
                        {ms.dueDate && (
                          <span className="flex items-center gap-1">
                            <CalendarClock className="h-3 w-3" /> Due: {fmtDate(ms.dueDate)}
                          </span>
                        )}
                        {linkedPhase && (
                          <span className="flex items-center gap-1">
                            <Layers className="h-3 w-3" /> Phase: {linkedPhase.name}
                          </span>
                        )}
                        {ms.acceptanceCriteria && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" /> {ms.acceptanceCriteria}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── Extra Notes ── */}
          {(job as any).extraField && (
            <Section title="Additional Notes">
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-sm leading-relaxed text-gray-300">{(job as any).extraField}</p>
              </div>
            </Section>
          )}

          {/* ── About the Client ── */}
          <Section title="About the Client">
            <motion.div
              whileHover={{ borderColor: "rgba(194,18,25,0.3)", boxShadow: "0 0 0 1px rgba(194,18,25,0.15)" }}
              transition={{ duration: 0.2 }}
              className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.08 }} transition={spring}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-red-600/30 bg-red-600/10 text-lg font-bold text-red-400">
                  {(job.organization ?? "?")[0].toUpperCase()}
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{job.organization ?? "Anonymous Client"}</p>
                  {job.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3 flex-shrink-0" /> {job.location}
                    </p>
                  )}
                </div>
                <motion.span animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 2.5 }}
                  className="flex flex-shrink-0 items-center gap-1 rounded-full bg-green-600/15 px-2.5 py-1 text-[10px] font-semibold text-green-400">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </motion.span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  job.rating != null && { top: <><Star className="inline h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {Number(job.rating).toFixed(1)}</>, bottom: "Rating" },
                  { top: fmt(job.budget, cur) ?? "—", bottom: "Project Value" },
                  { top: <span className="capitalize">{job.priority ?? "—"}</span>, bottom: "Priority" },
                ].filter(Boolean).map((stat: any, idx) => (
                  <motion.div key={idx} whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.08)" }} transition={spring}
                    className="rounded-xl bg-white/5 px-3 py-2.5 cursor-default">
                    <p className="flex items-center justify-center gap-1 font-bold text-white">{stat.top}</p>
                    <p className="mt-0.5 text-[10px] text-gray-500">{stat.bottom}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-white/10 pt-3 text-xs text-gray-500">
                {job.deadline && <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> Deadline: <span className="ml-1 text-gray-300">{fmtDate(job.deadline)}</span></span>}
                {job.timeline && <span>Timeline: <span className="text-gray-300">{job.timeline}</span></span>}
                {job.status   && <span>Status: <span className="capitalize text-gray-300">{job.status}</span></span>}
              </div>
            </motion.div>
          </Section>

          {/* ── Bidding ── */}
          {isRegisteredUser && (
            <Section title="Bidding Activity">
              {!deadlinePassed ? (
                <motion.div
                  animate={bidFocus ? { boxShadow: "0 0 0 2px rgba(194,18,25,0.5)" } : { boxShadow: "0 0 0 0px transparent" }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 flex gap-3 rounded-xl border border-white/20 bg-white/5 p-1 pl-3"
                >
                  <input
                    type="number" value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    onFocus={() => setBidFocus(true)} onBlur={() => setBidFocus(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleBidSubmit()}
                    placeholder={job.suggestedBidRange ? `Suggested: ${cur}${job.suggestedBidRange.min.toLocaleString()}–${cur}${job.suggestedBidRange.max.toLocaleString()}` : "Enter bid amount"}
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                  />
                  <motion.button onClick={handleBidSubmit}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} transition={spring}
                    disabled={!bidAmount}
                    className="rounded-lg bg-[#c21219] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 hover:bg-red-700">
                    Place Bid
                  </motion.button>
                </motion.div>
              ) : (
                <p className="mb-4 font-semibold text-red-400">Bidding is closed — deadline has passed.</p>
              )}
              <div className="space-y-3">
                <AnimatePresence>
                  {bidList.map((b) => (
                    <motion.div key={`${b.amount}-${b.date}`}
                      initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, height: 0 }} transition={spring}
                      className="flex justify-between rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                      <span className="font-semibold text-gray-200">{fmt(b.amount, cur)}</span>
                      <span className="text-sm text-gray-400">{new Date(b.date).toLocaleString()}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Section>
          )}

          <hr className="my-8 border-t border-white/20" />

          {/* ── Apply ── */}
          <div className="flex justify-end">
            <motion.button
              disabled={deadlinePassed}
              whileHover={!deadlinePassed ? { scale: 1.04, boxShadow: "0 0 24px rgba(194,18,25,0.5)" } : {}}
              whileTap={!deadlinePassed ? { scale: 0.96 } : {}}
              transition={spring}
              onClick={() => !deadlinePassed && setShowApplyModal(true)}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-lg transition ${deadlinePassed ? "cursor-not-allowed bg-gray-600 text-gray-300" : "bg-[#c21219] text-white hover:bg-red-700"}`}
            >
              {deadlinePassed ? "Deadline Passed" : (
                <>
                  Apply Now
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </>
              )}
            </motion.button>
          </div>

          {showApplyModal && (
            <ApplyModal
              job={job} isRegisteredUser={true} bids={bids} onBid={onBid}
              onClose={() => setShowApplyModal(false)}
              onSubmit={async (payload) => {
                try {
                  const res = await fetch("/api/projects/apply", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ projectId: job._id || job.id, amount: payload.bidAmount, coverLetter: payload.coverLetter, timeline: "Not specified" }),
                  });
                  const result = await res.json();
                  if (result.success) {
                    import("react-hot-toast").then((m) => m.default.success("Application submitted! 🚀"));
                    setShowApplyModal(false);
                    onClose();
                  } else {
                    import("react-hot-toast").then((m) => m.default.error(result.message || "Failed to apply"));
                  }
                } catch {
                  import("react-hot-toast").then((m) => m.default.error("Something went wrong ❌"));
                }
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div className="mb-8"
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}>
      <h3 className="mb-3 text-xl font-semibold tracking-wide text-white">{title}</h3>
      {children}
    </motion.div>
  );
}
