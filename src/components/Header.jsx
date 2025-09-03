"use client";

import { useCallback } from "react";
import Head from "next/head";
import { Typewriter } from "react-simple-typewriter";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import Serv from "./Serv";

export default function Header() {
  const particlesInit = useCallback(async (engine) => {
    // await loadFull(engine);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="We help businesses scale with cutting-edge digital solutions and strategic growth."
        />
        <meta
          name="keywords"
          content="business growth, digital strategy, web development, branding, startups"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <header className="relative min-h-screen w-full bg-black text-white overflow-hidden px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
        {/* Background Particles */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: false,
            particles: {
              number: { value: 40 },
              size: { value: 2 },
              color: { value: "#ffffff" },
              move: { enable: true, speed: 0.5 },
              opacity: { value: 0.5 },
            },
            background: { color: "transparent" },
          }}
          className="absolute inset-0 z-0"
        />
        <Particles
          id="tsparticles-container"
          init={particlesInit}
          options={{
            fullScreen: false,
            particles: {
              number: { value: 25 },
              size: { value: 2 },
              color: { value: "#ffffff" },
              move: { enable: true, speed: 0.6 },
              opacity: { value: 0.5 },
            },
            background: { color: "transparent" },
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Typing Text */}
        <div className="w-full md:w-2/3 z-10 pt-28 md:pt-0 text-center md:text-left">
          <h1 className="whitespace-pre-line text-2xl sm:text-3xl md:text-5xl font-extrabold leading-snug max-w-2xl mx-auto md:mx-0 px-2 font-display text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-white">
            <Typewriter
              words={["We build and grow\nworld-class organizations"]}
              loop={Infinity}
              typeSpeed={60}
              deleteSpeed={30}
              delaySpeed={1800}
              cursor
              cursorStyle="|"
            />
          </h1>
        </div>

        {/* Right – Serv Component */}
        <div className="w-full md:w-1/3 flex justify-end items-center mt-10 md:mt-0 z-10">
          <Serv />
        </div>
      </header>
    </>
  );
}
