import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI ?? "";

/* ── Global cache survives Next.js hot-reloads in dev ── */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn:    typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  /* Already have a live connection */
  if (
    global._mongooseCache.conn &&
    mongoose.connection.readyState === 1
  ) {
    return global._mongooseCache.conn;
  }

  /* Connection dropped — reset so we reconnect cleanly */
  if (
    global._mongooseCache.conn &&
    mongoose.connection.readyState !== 1
  ) {
    global._mongooseCache.conn    = null;
    global._mongooseCache.promise = null;
  }

  /* Kick off a new connection if none in-flight */
  if (!global._mongooseCache.promise) {
    global._mongooseCache.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands:           false,
        maxPoolSize:              100,
        minPoolSize:              10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS:          45000,
        heartbeatFrequencyMS:     10000,
        maxIdleTimeMS:            60000,
      })
      .then((conn) => {
        if (process.env.NODE_ENV !== "production") {
          mongoose.connection.on("error", (err) =>
            console.error("[MongoDB] connection error:", err)
          );
          mongoose.connection.on("disconnected", () => {
            /* Force reconnect on next call */
            global._mongooseCache.conn    = null;
            global._mongooseCache.promise = null;
          });
        }
        return conn;
      })
      .catch((err) => {
        /* Reset so the next request can retry */
        global._mongooseCache.promise = null;
        throw err;
      });
  }

  /* Await the in-flight promise (parallel callers share it) */
  global._mongooseCache.conn = await global._mongooseCache.promise;
  return global._mongooseCache.conn;
}

export default connectDB;
