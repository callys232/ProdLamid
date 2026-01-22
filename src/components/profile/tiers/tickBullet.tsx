// components/TickingBullet.tsx
"use client";

export default function TickingBullet() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Circle */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#c12129" // red accent
        strokeWidth="2"
        className="animate-[dash_2.5s_ease-in-out_infinite]"
        style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
      />
      {/* Checkmark */}
      <path
        d="M8 12.5l2.5 2.5L16 9"
        stroke="#000000" // black check
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[dash_2.5s_ease-in-out_infinite]"
        style={{ strokeDasharray: 20, strokeDashoffset: 20 }}
      />
      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dashoffset: var(--offset, 60);
            opacity: 0.6;
          }
          30% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          70% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: var(--offset, 60);
            opacity: 0.6;
          }
        }
      `}</style>
    </svg>
  );
}
