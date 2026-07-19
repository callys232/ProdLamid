"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const QUOTES = [
  {
    text: "The programs helped in the effective management and motivation of staff to enable them leverage their intellectual capability, transforming business challenges into real opportunities.",
    role: "Chief People Officer",
    org: "Enterprise Client",
  },
  {
    text: "LAMID TALENT's training program enhanced the quality of our negotiation processes and led to significant improvements in industrial relations between management and our teams.",
    role: "Chief Executive Officer",
    org: "Professional Services",
  },
];

const Testimonial: React.FC = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <section className="aivora-section py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row gap-10 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* Video */}
          <motion.div
            className="w-full md:w-2/5 shrink-0"
            variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          >
            <div
              className="relative aspect-video rounded-2xl overflow-hidden border border-[#2563EB]/30 bg-black cursor-pointer group"
              onClick={() => setVideoPlaying(!videoPlaying)}
            >
              {!videoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center shadow-[0_0_24px_rgba(37,99,235,0.6)]"
                  >
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  </motion.div>
                </div>
              ) : (
                <video className="w-full h-full object-cover" controls autoPlay src="/videos/demo-video.mp4" />
              )}
            </div>
          </motion.div>

          {/* Quotes */}
          <motion.div
            className="w-full"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          >
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Client Voices</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">
              What Leaders Say
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {QUOTES.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="aivora-card border rounded-2xl p-6 flex flex-col gap-3"
                >
                  <span className="text-3xl text-[#2563EB]/20 font-serif leading-none select-none">&ldquo;</span>
                  <p className="text-sm text-gray-600 dark:text-white/65 leading-relaxed italic flex-1">{q.text}</p>
                  <div className="pt-3 border-t border-gray-100 dark:border-white/6">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{q.role}</p>
                    <p className="text-[11px] text-gray-400 dark:text-white/30">{q.org}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
