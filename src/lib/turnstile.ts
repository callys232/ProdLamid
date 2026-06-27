/**
 * Cloudflare Turnstile server-side verification.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *
 * Set TURNSTILE_SECRET_KEY in .env (get from Cloudflare dashboard).
 * If the key is not set, verification is skipped (dev mode).
 */

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Skip in dev or if not configured
  if (!secret || process.env.NODE_ENV !== "production") return true;
  if (!token) return false;

  try {
    const form = new FormData();
    form.append("secret",   secret);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);

    const res  = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body:   form,
    });
    const data = await res.json() as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
