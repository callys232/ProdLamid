"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import BizSphereModal from "../BizSphereModal";
import AdvisorModal from "../AdvisorModal";
import BizPhereStickman from "./BizPhereStickman";
import styles from "./BizPhere.module.css";

const BizPhere: React.FC = () => {
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  return (
    <section className="relative bg-black text-white py-16 px-4 md:px-8 lg:px-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-900/10 blur-[100px]" />
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#c21219]/8 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ══ LEFT — BIZPHERE showcase ══ */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className={`relative rounded-2xl overflow-hidden ${styles.leftCard}`}
        >
          {/* Gradient base */}
          <div className={`absolute inset-0 z-0 ${styles.leftCardBg}`} />

          {/* Stickman-in-shopping-cart canvas — replaces line/dot patterns */}
          <BizPhereStickman />

          {/* Content sits above canvas */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-6">
            {/* Brand badge */}
            <div className="inline-flex items-center gap-3 self-start">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/20 border border-orange-500/35">
                <Zap className="h-5 w-5 text-orange-400" />
              </div>
              <h1 className="text-xl font-bold text-orange-500">BIZPHERE</h1>
            </div>

            <h2 className="text-xl hover:text-orange-400 transition">
              The exclusive business online networking{" "}
              <span className="text-orange-500">marketplace</span> where sellers
              meet buyers, and announce and exchange services and products.
            </h2>

            {/* Image */}
            <div className="mt-6 flex justify-center">
              <Image
                src="/biz-buy-sell-cards.png"
                alt="Buy and Sell cards"
                width={260}
                height={200}
                className="rounded hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </motion.div>

        {/* ══ RIGHT — Info + actions ══ */}
        <div className="flex flex-col gap-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className={`relative rounded-2xl p-6 sm:p-8 overflow-hidden space-y-4 ${styles.descCard}`}
          >
            <p className="hover:text-gray-300 transition">
              The platform to secure cutting edge information on finance,
              suppliers, assets, land and more resources. It sorts buyers and
              sellers and protects merchants as they advertise and interact!
            </p>
            <p className="hover:text-gray-300 transition">
              Our secured filters offer a clean online gateway that provides
              beneficial business intelligence.
            </p>
          </motion.div>

          {/* coming soon — reverted to button */}
          <motion.button
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
              delay: 0.08,
            }}
            onClick={() => setNotifyOpen(true)}
            className={`group relative self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-105 ${styles.notifyBtn}`}
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
            <span className="relative">Join the Community - coming soon!</span>
          </motion.button>

          {/* ASK AN ADVISOR — original layout, bigger image, opens modal */}
          <motion.button
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
              delay: 0.14,
            }}
            onClick={() => setAdvisorOpen(true)}
            className={`group w-full text-center rounded-2xl p-6 space-y-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${styles.advisorSection}`}
          >
            <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition">
              ASK AN ADVISOR FOR DIAGNOSTICS
            </h3>
            <div className="flex justify-center">
              <Image
                src="/help-note.png"
                alt="We can help you"
                width={200}
                height={150}
                className="rounded hover:scale-105 transition-transform"
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* ── Modals — separate reusable external components ── */}
      <BizSphereModal
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
      />
      <AdvisorModal
        isOpen={advisorOpen}
        onClose={() => setAdvisorOpen(false)}
      />
    </section>
  );
};

export default BizPhere;
