"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  projectId:    string;
  revieweeId:   string;  // who is being reviewed
  revieweeName: string;
  role:         "consultant" | "client"; // who the reviewer is rating
  onDone?:      () => void;
}

export default function LeaveReview({ projectId, revieweeId, revieweeName, role, onDone }: Props) {
  const [rating,  setRating]  = useState(0);
  const [hover,   setHover]   = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a rating"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId, revieweeId, rating, comment, role }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast.success("Review submitted!");
      setDone(true);
      onDone?.();
    } catch (e: any) {
      toast.error(e.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  if (done) return (
    <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-6 text-center">
      <p className="text-sm font-semibold text-green-400">Review submitted — thank you!</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-1 text-sm font-semibold text-white">Rate {revieweeName}</h3>
      <p className="mb-4 text-xs text-gray-500">
        {role === "consultant" ? "How was this consultant's work?" : "How was working with this client?"}
      </p>

      {/* Star selector */}
      <div className="mb-4 flex gap-1">
        {[1,2,3,4,5].map(n => (
          <motion.button key={n} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className="transition"
          >
            <Star className={`h-6 w-6 ${(hover || rating) >= n ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
          </motion.button>
        ))}
        {rating > 0 && (
          <span className="ml-2 self-center text-xs text-gray-600">
            {["","Poor","Fair","Good","Great","Excellent"][rating]}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience (optional)…"
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#2563EB]/40 focus:outline-none"
        />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          {loading ? "Submitting…" : "Submit Review"}
        </motion.button>
      </form>
    </motion.div>
  );
}
