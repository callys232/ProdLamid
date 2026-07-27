/**
 * Addresses of the platforms that sit outside this application.
 *
 * These URLs were repeated across nine files — API prompts, agents, tool cards,
 * the SSO validator. Moving the LMS would have meant finding all nine and
 * getting every one right. They are read from here now, so a change is a single
 * edit, or an environment variable with no edit at all.
 *
 * Client components can only see NEXT_PUBLIC_* variables, so each has a public
 * alias; the server-only name is preferred where both are present.
 */

const stripTrailingSlash = (u: string) => u.replace(/\/+$/, "");

/** External learning platform. Users arrive via /talent/lms, which mints an SSO code. */
export const LMS_URL = stripTrailingSlash(
  process.env.LMS_URL ??
  process.env.NEXT_PUBLIC_LMS_URL ??
  "https://learn-by-lamid.vercel.app",
);

/** External document sharing platform, reached through /docushare. */
export const DOCUSHARE_URL = stripTrailingSlash(
  process.env.DOCUSHARE_URL ??
  process.env.NEXT_PUBLIC_DOCUSHARE_URL ??
  "https://fileshare-six-phi.vercel.app",
);

/** Origin only — for SSO origin checks, where a path would never match. */
export const LMS_ORIGIN = (() => {
  try { return new URL(LMS_URL).origin; }
  catch { return LMS_URL; }
})();

/** The in-app route that hands a signed-in user to the LMS with SSO. */
export const LMS_ENTRY_ROUTE = "/talent/lms";
