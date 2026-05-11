import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI environment variable is required");

declare global {
  // Persist connection across hot-reloads in dev
  // eslint-disable-next-line no-var
  var _mongoConn: typeof mongoose | undefined;
}

async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (global._mongoConn) return global._mongoConn;

  const conn = await mongoose.connect(MONGO_URI!, {
    bufferCommands:             false,
    maxPoolSize:                100,   // max concurrent connections
    minPoolSize:                10,    // keep-alive floor
    serverSelectionTimeoutMS:   3000,
    socketTimeoutMS:            45000,
    heartbeatFrequencyMS:       10000,
    maxIdleTimeMS:              60000,
  });

  // Log connection events in dev
  if (process.env.NODE_ENV !== "production") {
    mongoose.connection.on("error", (err) =>
      console.error("[MongoDB] connection error:", err)
    );
  }

  if (process.env.NODE_ENV !== "production") global._mongoConn = conn;
  return conn;
}

export default connectDB;
