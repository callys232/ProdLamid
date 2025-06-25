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
      },
    },
  },
  plugins: [],
};
