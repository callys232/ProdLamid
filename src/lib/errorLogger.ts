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

  // Structured JSON log (picked up by any log aggregator / Datadog / CloudWatch)
  console.error(JSON.stringify({ level: "error", ...payload }));

  // Sentry capture when DSN is configured
  if (process.env.SENTRY_DSN) {
    import("@sentry/nextjs")
      .then(Sentry => {
        Sentry.withScope((scope: any) => {
          if (context.userId) scope.setUser({ id: context.userId });
          if (context.route)  scope.setTag("route", context.route);
          if (context.extra)  scope.setExtras(context.extra);
          Sentry.captureException(err);
        });
      })
      .catch(() => { /* Sentry unavailable */ });
  }
}

// API route error wrapper
export function apiError(e: unknown, context: ErrorContext = {}) {
  logError(e, context);
  const message = e instanceof Error ? e.message : "Internal server error";
  return { success: false, message };
}
