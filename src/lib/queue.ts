/**
 * Job queue — BullMQ backed by Redis.
 * Falls back to immediate in-process execution when Redis is not configured
 * (dev environments without Redis).
 */

import type { ConnectionOptions } from "bullmq";

/* ── Job payload types ───────────────────────────────────────── */
export interface EmailJob {
  type: "email";
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface PointsJob {
  type: "points";
  userId: string;
  amount: number;
  description: string;
  reference: string;
}

export interface NotificationJob {
  type: "notification";
  userId: string;
  title: string;
  message: string;
  link?: string;
  notifType?: string;
}

export type JobPayload = EmailJob | PointsJob | NotificationJob;

/* ── Connection ──────────────────────────────────────────────── */
function getConnection(): ConnectionOptions | null {
  if (!process.env.REDIS_URL) return null;
  // Upstash Redis uses HTTPS — BullMQ needs a standard Redis URL
  // Set BULL_REDIS_URL separately if using Upstash (use a standard Redis instance for BullMQ)
  const url = process.env.BULL_REDIS_URL ?? process.env.REDIS_URL;
  return { url };
}

/* ── Immediate fallback (no Redis) ───────────────────────────── */
async function runImmediate(job: JobPayload): Promise<void> {
  switch (job.type) {
    case "email": {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        service: process.env.NOTIFICATION_SMTP_SERVICE,
        auth: { user: process.env.NOTIFICATION_EMAIL_USER, pass: process.env.NOTIFICATION_EMAIL_PASS },
      });
      await transporter.sendMail({
        from: `"Lamid" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: job.to, subject: job.subject, html: job.html,
        ...(job.text && { text: job.text }),
      });
      break;
    }
    case "points": {
      const { awardPoints } = await import("@/lib/services/pointsService");
      await awardPoints(job.userId, job.amount, job.description, job.reference);
      break;
    }
    case "notification": {
      const { Notification } = await import("@/lib/models/Notification");
      const connectDB = (await import("@/lib/db")).default;
      await connectDB();
      await Notification.create({
        user:    job.userId,
        title:   job.title,
        message: job.message,
        link:    job.link,
        type:    job.notifType ?? "system",
        read:    false,
      });
      break;
    }
  }
}

/* ── Queue ───────────────────────────────────────────────────── */
let _queue: import("bullmq").Queue | null = null;

async function getQueue() {
  if (_queue) return _queue;
  const conn = getConnection();
  if (!conn) return null;
  const { Queue } = await import("bullmq");
  _queue = new Queue("lamid-jobs", {
    connection: conn,
    defaultJobOptions: {
      attempts:    3,
      backoff:     { type: "exponential", delay: 2000 },
      removeOnComplete: { count: 100 },
      removeOnFail:     { count: 500 },
    },
  });
  return _queue;
}

/* ── Public API ──────────────────────────────────────────────── */
export async function enqueue(job: JobPayload): Promise<void> {
  const q = await getQueue();
  if (q) {
    await q.add(job.type, job);
  } else {
    // No Redis — run immediately (dev / single-instance)
    runImmediate(job).catch(console.error);
  }
}

/* ── Convenience helpers ─────────────────────────────────────── */
export const jobs = {
  email: (to: string, subject: string, html: string) =>
    enqueue({ type: "email", to, subject, html }),

  points: (userId: string, amount: number, description: string, reference: string) =>
    enqueue({ type: "points", userId, amount, description, reference }),

  notify: (userId: string, title: string, message: string, link?: string, notifType?: string) =>
    enqueue({ type: "notification", userId, title, message, link, notifType }),
};
