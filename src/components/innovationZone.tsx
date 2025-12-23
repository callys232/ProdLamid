"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface PipelineStage {
  description: string;
  icon: string;
  href: string;
  bg: string;
  border: string;
  text?: string;
}

const stages: PipelineStage[] = [
  {
    description: "Identify and validate promising startup ideas.",
    icon: "/icons/opportunities.png",
    href: "/innovazion/opportunities",
    bg: "bg-purple-700",
    border: "border-purple-500",
  },
  {
    description: "Build scalable frameworks and digital systems.",
    icon: "/icons/structures.png",
    href: "/innovazion/structures",
    bg: "bg-black",
    border: "border-gray-700",
  },
  {
    description: "Expert guidance to accelerate growth.",
    icon: "/icons/mentoring.png",
    href: "/innovazion/mentoring",
    bg: "bg-teal-600",
    border: "border-teal-400",
  },
  {
    description: "Rapid prototyping to test and refine ideas.",
    icon: "/icons/prototype.png",
    href: "/innovazion/prototype",
    bg: "bg-red-600",
    border: "border-red-400",
  },
  {
    description: "Access elite talent for execution.",
    icon: "/icons/talent.png",
    href: "/innovazion/talent",
    bg: "bg-orange-500",
    border: "border-orange-400",
  },
  {
    description: "Collaborate with partners for expansion.",
    icon: "/icons/joint-ventures.png",
    href: "/innovazion/joint-ventures",
    bg: "bg-green-600",
    border: "border-green-400",
  },
  {
    description: "Reinforce infrastructure for scaling.",
    icon: "/icons/structures.png",
    href: "/innovazion/structures-2",
    bg: "bg-black",
    border: "border-gray-700",
  },
  {
    description: "Connect to international markets and networks.",
    icon: "/icons/global-access.png",
    href: "/innovazion/global-access",
    bg: "bg-white",
    border: "border-gray-300",
    text: "text-black",
  },
];

const InnovazionZone: FC = () => {
  return (
    <section className="bg-black py-10 px-4 text-white">
      <div className="flex flex-wrap justify-center gap-8">
        {stages.map((stage) => (
          <Link key={stage.description} href={stage.href} className="group">
            <div
              className={`w-[160px] h-[240px] rounded-xl ${stage.bg} ${stage.border} border 
                          shadow-md transition-all duration-300 
                          flex flex-col items-center justify-start text-center p-5
                          hover:brightness-60 hover:border-red-500`}
            >
              {/* Icon */}
              <div className="w-12 h-12 mb-6">
                <Image
                  src={stage.icon}
                  alt="stage icon"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Animated Curled Arrow */}
              <div className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="36"
                  height="36"
                  className="text-red-500 mx-auto"
                >
                  <path
                    d="M25 5 C25 20, 5 20, 25 35 L25 45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="group-hover:[stroke-dasharray:100] group-hover:[stroke-dashoffset:100] group-hover:animate-[draw_1s_ease-in-out_forwards]"
                  />
                  <polygon points="20,45 30,45 25,50" fill="currentColor" />
                </svg>
              </div>

              {/* Description */}
              <p
                className={`text-xs leading-snug ${
                  stage.text ?? "text-gray-200"
                }`}
              >
                {stage.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Caption */}
      <p className="mt-10 text-center text-sm text-gray-300">
        Over <span className="text-yellow-400 font-bold">3000</span> start-ups
        created and accelerated.{" "}
        <span className="text-red-500 font-semibold">
          Be the next raving success!
        </span>
      </p>

      {/* Keyframes for arrow draw animation */}
      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default InnovazionZone;
