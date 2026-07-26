"use client";

import { createContext, useContext } from "react";

export type GateMode =
  | "full"               // has the required access level
  | "preview-auth"       // not logged in → sign up
  | "preview-tier"       // logged in but needs a higher plan → upgrade
  | "preview-enterprise" // needs Enterprise account
  | "preview-concierge"; // needs Concierge account

const GateContext = createContext<{ mode: GateMode }>({ mode: "full" });

export const useGate = () => useContext(GateContext);
export const GateProvider = GateContext.Provider;
