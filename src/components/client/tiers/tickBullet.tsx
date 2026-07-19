"use client";

export default function TickingBullet() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#2563EB"
        strokeWidth="2"
        strokeDasharray="56"
        strokeDashoffset="56"
        className="tick-circle"
      />

      <path
        d="M8 12.5l2.5 2.5L16 9"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="18"
        strokeDashoffset="18"
        className="tick-check"
      />

      <style jsx>{`
        .group:hover .tick-circle {
          animation: drawCircle 0.4s ease forwards;
        }

        .group:hover .tick-check {
          animation: drawCheck 0.35s ease 0.2s forwards;
        }

        @keyframes drawCircle {
          from {
            stroke-dashoffset: 56;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes drawCheck {
          from {
            stroke-dashoffset: 18;
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>
    </svg>
  );
}