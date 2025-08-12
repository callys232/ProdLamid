"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const EventHeader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="relative min-h-screen bg-black"
      aria-labelledby="event-heading"
    >
      <Head>
        <meta
          name="description"
          content="Join Lamid Consulting's innovation-driven events designed to inspire, build, and grow world-class organizations."
        />
        <meta
          name="keywords"
          content="Lamid events, innovation, entrepreneurship, business growth, leadership, networking, community building"
        />
        <meta name="author" content="Lamid Consulting" />
        <meta
          property="og:title"
          content="Lamid Events | Innovate, Build, Grow"
        />
        <meta
          property="og:description"
          content="Explore Lamid Consulting's events that foster innovation, collaboration, and sustainable growth."
        />
        <meta
          property="og:image"
          content="https://lamidconsulting.com/event_lightbulb.png"
        />
        <meta property="og:url" content="https://lamidconsulting.com/events" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://lamidconsulting.com/events" />
      </Head>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-blue-900/30">
          {mounted && (
            <Image
              src="/LD2.jpg"
              alt="Background audience"
              fill
              className="object-cover mix-blend-overlay opacity-80"
              priority
            />
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20 text-white">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto gap-8 md:gap-16">
          {/* Light bulb image */}
          <figure className="relative bg-black rounded-lg shadow-2xl overflow-hidden w-full max-w-sm aspect-square md:w-2/5">
            <div className="p-8 flex items-center justify-center h-full">
              {mounted && (
                <Image
                  src="/event_lightbulb.png"
                  alt="Light bulb symbolizing innovation"
                  width={250}
                  height={250}
                  priority
                  className="glow-circle transition-transform duration-300 ease-in-out hover:scale-110 hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                />
              )}
            </div>
          </figure>

          {/* Text content */}
          <div className="text-center md:text-left w-full md:w-3/5">
            <h1
              id="event-heading"
              className="text-6xl md:text-8xl font-bold tracking-wider space-y-2"
            >
              {["INNOVATE", "BUILD", "GROW"].map((word, i) => (
                <span
                  key={word}
                  className={`block pop-item animate-colorCycle drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  {word}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </main>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes colorCycle {
          0% {
            color: #ffffff;
          }
          25% {
            color: #f97316;
          }
          50% {
            color: #22c55e;
          }
          75% {
            color: #3b82f6;
          }
          100% {
            color: #ffffff;
          }
        }

        .animate-colorCycle {
          animation: colorCycle 6s infinite ease-in-out;
        }

        .pop-item {
          transition: transform 0.3s ease, text-shadow 0.3s ease;
        }

        .pop-item:hover {
          transform: scale(1.05);
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </header>
  );
};

export default EventHeader;
