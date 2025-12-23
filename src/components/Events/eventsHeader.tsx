"use client";

import Head from "next/head";
import Image from "next/image";
import useProgressiveTypewriter from "@/hooks/progressiveTexe";

const EventHeader: React.FC = () => {
  const texts = useProgressiveTypewriter(
    ["INNOVATE", "BUILD", "GROW"],
    [
      "bg-gradient-to-r from-blue-400 to-white",
      "bg-gradient-to-r from-red-500 to-white",
      "bg-gradient-to-r from-green-400 to-white",
    ],
    120,
    2000
  );

  return (
    <div className="relative bg-black">
      <Head>
        <title>Innovate | Build | Grow</title>
        <meta name="description" content="Innovation landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background image with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/events-bg.jpg" // ✅ replace with your background image path
          alt="Events background"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 text-white">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto gap-6 md:gap-10">
          {/* Light bulb image */}
          <div className="relative bg-black/70 rounded-lg shadow-2xl w-full max-w-sm md:w-2/5">
            <div className="p-6 flex items-center justify-center h-full">
              <Image
                src="/event_lightbulb.png"
                alt="Light bulb"
                width={220}
                height={220}
                priority
                className="drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
              />
            </div>
          </div>

          {/* Progressive Typewriter text */}
          <div className="text-center md:text-left w-full md:w-3/5">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight flex flex-col gap-2">
              {texts.map((item, i) => (
                <span
                  key={i}
                  className={`${item.gradient} bg-clip-text text-transparent animate-pulse`}
                >
                  {item.text}
                </span>
              ))}
              <span className="inline-block w-1 bg-white ml-1 animate-blink"></span>
            </h1>
          </div>
        </div>

        {/* Supporting tagline */}
        <div className="w-full mt-6 space-y-2">
          <p className="text-[#C12129] text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center mx-auto max-w-4xl px-4">
            Driving transformation through innovation and growth.
          </p>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl text-center mx-auto max-w-3xl px-4 italic">
            Empowering ideas to become reality, and reality to inspire the
            future.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EventHeader;
