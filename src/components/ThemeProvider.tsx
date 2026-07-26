"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  /* Dark is the default. enableSystem stays off so every visitor lands on the
     same theme rather than inheriting their OS setting.
     Note: the ecosystem section deliberately inverts against this — it renders
     a white ground while the rest of the site is dark. See EcosystemHubs. */
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
