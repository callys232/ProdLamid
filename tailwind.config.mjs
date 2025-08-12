/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        typing: "typing 4s steps(40, end) forwards",
        blink: "blink 0.8s step-end infinite",
        float: "float 6s ease-in-out infinite",
        colorCycle: "colorCycle 6s ease-in-out infinite",
        rainbowPulse: "rainbowPulse 2s linear infinite",
        bounceSlow: "bounceSlow 2s infinite ease-in-out",
        glitch: "glitch 1.5s infinite",
        wave: "wave 2s infinite ease-in-out",
        colorType: "colorType 2s linear infinite",
        colorTrail: "colorTrail 2s linear infinite",
        fadeInUp: "fadeInUp 1s ease-out forwards",
        glitchPulse: "glitchPulse 3s infinite",
        fadeIn: "fadeIn 0.4s ease-out forwards",
        blurIn: "blurIn 6s ease-out forwards", // ✅ Added for modal
      },
      keyframes: {
        typing: {
          "0%": { width: "0" },
          "40%, 60%": { width: "100%" },
          "100%": { width: "0" },
        },
        blink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "white" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        colorCycle: {
          "0%": { color: "#f97316" },
          "25%": { color: "#22d3ee" },
          "50%": { color: "#C12129" },
          "75%": { color: "#34d399" },
          "100%": { color: "#f97316" },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glitch: {
          "0%": {
            textShadow: "2px 0 red, -2px 0 cyan",
            transform: "translate(0)",
          },
          "20%": {
            textShadow: "-2px 0 red, 2px 0 cyan",
            transform: "translate(-1px, 1px)",
          },
          "40%": {
            textShadow: "2px 0 red, -1px 0 cyan",
            transform: "translate(1px, -1px)",
          },
          "60%": {
            textShadow: "1px 0 red, 1px 0 cyan",
            transform: "translate(-1px, 0px)",
          },
          "80%": {
            textShadow: "-1px 0 red, 2px 0 cyan",
            transform: "translate(0px, 1px)",
          },
          "100%": {
            textShadow: "2px 0 red, -2px 0 cyan",
            transform: "translate(0)",
          },
        },
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-5px)" },
          "50%": { transform: "translateY(5px)" },
          "75%": { transform: "translateY(-5px)" },
        },
        colorType: {
          "0%": { color: "#f97316" },
          "25%": { color: "#22d3ee" },
          "50%": { color: "#C12129" },
          "75%": { color: "#34d399" },
          "100%": { color: "#f97316" },
        },
        colorTrail: {
          "0%": { color: "#f97316" },
          "25%": { color: "#22d3ee" },
          "50%": { color: "#C12129" },
          "75%": { color: "#34d399" },
          "100%": { color: "#f97316" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        rainbowPulse: {
          "0%": { color: "#f97316" },
          "25%": { color: "#22d3ee" },
          "50%": { color: "#C12129" },
          "75%": { color: "#34d399" },
          "100%": { color: "#f97316" },
        },
        glitchPulse: {
          "0%": {
            textShadow: "2px 0 red, -2px 0 cyan",
            transform: "translate(0)",
          },
          "20%": {
            textShadow: "-2px 0 red, 2px 0 cyan",
            transform: "translate(-1px, 1px)",
          },
          "40%": {
            textShadow: "2px 0 red, -1px 0 cyan",
            transform: "translate(1px, -1px)",
          },
          "60%": {
            textShadow: "1px 0 red, 1px 0 cyan",
            transform: "translate(-1px, 0px)",
          },
          "80%": {
            textShadow: "-1px 0 red, 2px 0 cyan",
            transform: "translate(0px, 1px)",
          },
          "100%": {
            textShadow: "2px 0 red, -2px 0 cyan",
            transform: "translate(0)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blurIn: {
          "0%": { opacity: 0, filter: "blur(10px)" },
          "100%": { opacity: 1, filter: "blur(0)" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
