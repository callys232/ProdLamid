"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  EMPTY_PROFILE,
  loadProfile,
  saveProfile,
  syncDown,
  type OrganizationProfile,
} from "@/lib/profile/organizationProfile";

/**
 * The shared organisation profile, for intake forms.
 *
 * `ready` matters: the profile is only readable on the client, so forms must
 * wait for it before seeding their fields. Seeding on the first render would
 * either fight React hydration or silently overwrite something the user had
 * already begun typing.
 */
export function useOrganizationProfile() {
  const [profile, setProfile] = useState<OrganizationProfile>(EMPTY_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Local first so fields fill immediately, then reconcile with the server.
    setProfile(loadProfile());
    setReady(true);
    void syncDown().then(setProfile);
  }, []);

  const update = useCallback((patch: Partial<OrganizationProfile>) => {
    setProfile(saveProfile(patch));
  }, []);

  return { profile, ready, update };
}

/**
 * Seed a form from the profile exactly once, and only into fields the user has
 * not already filled.
 *
 * @param ready  whether the profile has loaded
 * @param apply  receives the profile; set your state from it here
 */
export function useProfileSeed(
  ready: boolean,
  profile: OrganizationProfile,
  apply: (p: OrganizationProfile) => void,
) {
  const seeded = useRef(false);
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    if (!ready || seeded.current) return;
    seeded.current = true;
    applyRef.current(profile);
  }, [ready, profile]);
}
