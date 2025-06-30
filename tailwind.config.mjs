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
        typing:
          "typing 5s steps(30, end) infinite, blink 0.75s step-end infinite",
        blink: "blink 0.75s step-end infinite",
        float: "float 2.5s ease-in-out infinite",
        colorCycle: "colorCycle 6s ease-in-out infinite",
        bounceSlow: "bounceSlow 2s infinite ease-in-out",
        glitch: "glitch 1.5s infinite",
        wave: "wave 2s infinite ease-in-out",
        colorType: "colorType 2s linear infinite",
        colorTrail: "colorTrail 2s linear infinite",
        glitch: "glitch 1.5s infinite",
        colorTrail: "colorTrail 2s linear infinite",
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
          "50%": { transform: "translateY(-6px)" },
        },
        colorCycle: {
          "0%": { color: "#f97316" }, // orange-500
          "25%": { color: "#22d3ee" }, // cyan-400
          "50%": { color: "#C12129" }, // your brand red
          "75%": { color: "#34d399" }, // green-400
          "100%": { color: "#f97316" }, // loop back to orange
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
          "0%": { color: "#f97316" }, // orange-500
          "25%": { color: "#22d3ee" }, // cyan-400
          "50%": { color: "#C12129" }, // your red
          "75%": { color: "#34d399" }, // green-400
          "100%": { color: "#f97316" },
        },
        colorTrail: {
          "0%": { color: "#f97316" },
          "25%": { color: "#22d3ee" },
          "50%": { color: "#C12129" },
          "75%": { color: "#34d399" },
          "100%": { color: "#f97316" },
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
        colorTrail: {
          "0%": { color: "#f97316" },
          "25%": { color: "#22d3ee" },
          "50%": { color: "#C12129" },
          "75%": { color: "#34d399" },
          "100%": { color: "#f97316" },
        },
      },
    },
  },
  plugins: [],
};
