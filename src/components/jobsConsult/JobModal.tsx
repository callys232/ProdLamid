"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Project, Milestone } from "@/types/project";
import { Consultant } from "@/types/client";
import ApplyModal from "./applyModal";

interface JobModalProps {
  job: Project;
  isRegisteredUser?: boolean;
  onClose: () => void;
  onApply: (job: Project) => void;
  onBid: (job: Project, amount: number) => void;
  bids?: { amount: number; date: string }[];
  // consultant: Consultant; // ✅ REQUIRED
  // client?: Client;
}

export default function JobModal({
  job,
  isRegisteredUser = false,
  onClose,
  onApply,
  onBid,
  bids = [],
}: JobModalProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [bidList, setBidList] = useState(bids);
  const [bidAmount, setBidAmount] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  /* ✅ COUNTDOWN TIMER + DEADLINE LOCKOUT */
  const [timeLeft, setTimeLeft] = useState("");
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  useEffect(() => {
    if (!job.deadline) {
      // Avoid synchronous setState warning
      setTimeout(() => setTimeLeft("No deadline"), 0);
      return;
    }

    const end = new Date(job.deadline).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setDeadlinePassed(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown(); // run immediately
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [job.deadline]);

  /* ✅ HANDLE BIDS */
  const handleBidSubmit = () => {
    if (!bidAmount || deadlinePassed) return;

    const newBid = {
      amount: Number(bidAmount),
      date: new Date().toISOString(),
    };

    setBidList((prev) => [newBid, ...prev]);
    onBid(job, Number(bidAmount));
    setBidAmount("");
  };

  const images = (Array.isArray(job.images) ? job.images : [job.image]).filter(
    Boolean
  ) as string[];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-5xl w-full text-gray-100 relative overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-3xl font-light"
          >
            ×
          </button>

          {/* Images */}
          {images.length > 0 && (
            <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-8 shadow-xl">
              <Image
                src={images[currentImage]}
                alt={job.title}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImage((p) =>
                        p === 0 ? images.length - 1 : p - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage((p) =>
                        p === images.length - 1 ? 0 : p + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-4xl font-bold mb-2 text-white">{job.title}</h2>

          <p className="text-sm text-gray-300 mb-1">
            {job.organization} {job.location && `— ${job.location}`}
          </p>

          <p className="text-sm text-gray-400 mb-6">
            {job.category} {job.tech && `| ${job.tech}`}
          </p>

          {/* ✅ Countdown Timer */}
          {job.deadline && (
            <div
              className={`px-4 py-3 rounded-xl mb-6 inline-block ${
                deadlinePassed
                  ? "bg-red-700 text-white"
                  : "bg-white/10 border border-white/20 text-gray-200"
              }`}
            >
              <span className="font-semibold">Time Left:</span>{" "}
              <span
                className={`ml-2 font-bold ${
                  timeLeft.includes("0d") ? "text-red-400" : "text-white"
                }`}
              >
                {timeLeft}
              </span>
            </div>
          )}

          {/* Metrics */}
          <div className="flex flex-wrap gap-4 mb-8">
            {job.budget && <Metric label="Budget" value={job.budget} />}
            {job.hourlyRate && (
              <Metric label="Hourly rate" value={job.hourlyRate} />
            )}
            {job.priority && <Metric label="Priority" value={job.priority} />}
          </div>

          {/* Description */}
          {job.description && (
            <Section title="Description">
              <p className="text-gray-300 leading-relaxed">{job.description}</p>
            </Section>
          )}

          {/* ✅ Bidding Section (Only for Logged‑In Users) */}
          {isRegisteredUser && (
            <Section title="Bidding Activity">
              {!deadlinePassed ? (
                <div className="flex gap-3 mb-4">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white w-40"
                  />
                  <button
                    onClick={handleBidSubmit}
                    className="px-4 py-2 bg-[#c21219] hover:bg-red-700 rounded-lg text-white"
                  >
                    Place Bid
                  </button>
                </div>
              ) : (
                <p className="text-red-400 font-semibold mb-4">
                  Bidding is closed — deadline has passed.
                </p>
              )}

              <div className="space-y-3">
                {bidList.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between bg-white/10 border border-white/20 px-4 py-3 rounded-lg"
                  >
                    <span className="text-gray-200 font-semibold">
                      ${b.amount}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(b.date).toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          <hr className="border-t border-white/20 my-8" />

          {/* ✅ Apply Button */}
          <div className="flex justify-end">
            <button
              disabled={deadlinePassed}
              className={`px-6 py-3 rounded-xl font-semibold transition shadow-lg ${
                deadlinePassed
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-[#c21219] hover:bg-red-700 text-white"
              }`}
              onClick={() => !deadlinePassed && setShowApplyModal(true)}
            >
              {deadlinePassed ? "Deadline Passed" : "Apply Now"}
            </button>
          </div>

          {/* ✅ Apply Modal */}
          {showApplyModal && (
            <ApplyModal
              job={job}
              // consultant={loggedInConsultant}
              // client={0}
              isRegisteredUser={true}
              bids={bids}
              onBid={onBid}
              onClose={() => setShowApplyModal(false)}
              onSubmit={(payload) => {}}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* -------------------- Helper Components -------------------- */
function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-5 py-4 bg-white/10 border border-white/20 rounded-xl shadow-md">
      <p className="font-semibold text-[#c21219] text-lg">{value}</p>
      <p className="text-sm text-gray-300">{label}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}
