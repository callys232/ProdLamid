"use client";

import PromoLeft from "./UsingAi";

interface PromoSectionProps {
  botUrl: string;
  videoSrc: string; // path to your video or gif
}

export default function PromoSection({ botUrl, videoSrc }: PromoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#c21219] p-8 rounded-lg">
      {/* Left reusable component */}
      <PromoLeft
        title="Smart Hiring Starts Here"
        subtitle="Tell us what you need, and you are one step closer"
        botUrl={botUrl}
      />

      {/* Right-hand side video/GIF */}
      <div className="flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="rounded-lg shadow-lg w-full h-auto"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
