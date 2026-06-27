"use client";

export type InteractionState = "full" | "preview" | "locked";

export function useInteractionState(isPremium: boolean): InteractionState {
  if (isPremium) return "full";
  return "preview"; // default free tier is preview, not locked
}