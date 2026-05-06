"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FULL_TEXT = "We build and grow world-class organizations";

export default function Header() {
  const { scrollY } = useScroll();

  const yHeading = useTransform(scrollY, [0, 300], [0, -50]);
  const yParagraph = useTransform(scrollY, [0, 300], [0, -30]);
  const yImage = useTransform(scrollY, [0, 300], [0, 40]);

  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      i++;
      setDisplayed(FULL_TEXT.slice(0, i));
      if (i < FULL_TEXT.length) {
        setTimeout(tick, 48 + Math.random() * 30);
      } else {
        setDone(true);
      }
    };
    const start = setTimeout(tick, 400);
    return () => clearTimeout(start);
  }, []);

  return (
    <header className="relative w-full overflow-hidden bg-black">

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black" />
      </div>

      {/* LAYOUT */}
      <div className="relative z-10 flex flex-col md:flex-row items-center">

        {/* TEXT COLUMN */}
        <div className="relative w-full md:w-1/2 px-6 sm:px-8 md:px-12 pt-24 md:pt-0 flex flex-col items-center md:items-start text-center md:text-left gap-8">

          {/* HEADING — typewriter + gradient */}
          <div className="w-full">
            <motion.h1
              style={{ y: yHeading }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-xl leading-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {displayed}
              {!done && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[0.85em] bg-white/60 ml-1 align-middle animate-[blink_1s_step-end_infinite]"
                />
              )}
            </motion.h1>
          </div>

          {/* PARAGRAPH — serif complement via system font stack */}
          <div className="w-full">
            <motion.p
              style={{ y: yParagraph, fontFamily: "Georgia, 'Times New Roman', serif" }}
              className="text-base sm:text-lg md:text-xl leading-relaxed font-normal max-w-lg text-gray-300/80 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Our AI-driven consulting system unifies project matching and
              end-to-end delivery into a single intelligent marketplace—
              combining CRM and project management in one platform.
            </motion.p>
          </div>

        </div>

        {/* IMAGE */}
        <motion.div
          style={{ y: yImage }}
          className="w-full md:w-1/2 h-[45vh] sm:h-[50vh] md:h-screen relative"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <Image
            src="/Home1.png"
            alt="Business consulting illustration"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover md:object-right opacity-80 md:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
        </motion.div>

      </div>
    </header>
  );
}
