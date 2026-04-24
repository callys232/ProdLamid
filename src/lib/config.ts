const DEV_FALLBACK = "dev_secret_key_change_before_going_live";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Required environment variable "${name}" is not set. ` +
        `Set it in your hosting environment before deploying.`
      );
    }
    console.warn(
      `[config] "${name}" is not set. Using insecure dev fallback — ` +
      `set a real value before going live.`
    );
    return DEV_FALLBACK;
  }
  return value;
}

// In production this throws at startup if JWT_SECRET is missing.
// In development it falls back with a console warning.
export const jwtSecret = requireEnv("JWT_SECRET");
