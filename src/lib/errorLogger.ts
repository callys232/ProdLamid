// Structured error logger — swappable with Sentry when DSN is configured.
// Set SENTRY_DSN in .env to enable Sentry capture; otherwise errors are logged to console.

interface ErrorContext {
  userId?:  string;
  route?:   string;
  extra?:   Record<string, unknown>;
}

export function logError(error: unknown, context: ErrorContext = {}) {
  const err      = error instanceof Error ? error : new Error(String(error));
  const payload  = {
    message:   err.message,
    stack:     err.stack,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // Console fallback (always)
  console.error("[Lamid Error]", JSON.stringify(payload, null, 2));

  // Sentry integration — uncomment when @sentry/nextjs is installed
  // if (process.env.SENTRY_DSN) {
  //   const Sentry = require("@sentry/nextjs");
  //   Sentry.withScope((scope: any) => {
  //     if (context.userId)  scope.setUser({ id: context.userId });
  //     if (context.route)   scope.setTag("route", context.route);
  //     if (context.extra)   scope.setExtras(context.extra);
  //     Sentry.captureException(err);
  //   });
  // }
}

// API route error wrapper
export function apiError(e: unknown, context: ErrorContext = {}) {
  logError(e, context);
  const message = e instanceof Error ? e.message : "Internal server error";
  return { success: false, message };
}
