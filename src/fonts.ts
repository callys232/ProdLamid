// src/fonts.ts
import { Inter, Playfair_Display } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"], // Medium and Black
  variable: "--font-inter",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular and Black
  variable: "--font-playfair",
  display: "swap",
});
