// src/fonts.ts
import { Inter, Playfair_Display, Space_Grotesk } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"], // Medium and Black
  variable: "--font-inter",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
