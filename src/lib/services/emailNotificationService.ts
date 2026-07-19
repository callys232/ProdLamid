import { notificationTransporter } from "@/lib/mailer";
import { Users } from "@/lib/models/User";

interface NotificationEmailPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
  ctaUrl?: string;
}

const TYPE_SUBJECT: Record<string, string> = {
  message:   "New message on Lamid",
  milestone: "Milestone update on Lamid",
  payment:   "Payment update on Lamid",
  escrow:    "Escrow update on Lamid",
  system:    "Update from Lamid",
  alert:     "Alert from Lamid",
  activity:  "Activity update on Lamid",
};

export async function sendNotificationEmail({ userId, title, message, type, ctaUrl }: NotificationEmailPayload) {
  try {
    const user = await Users.findById(userId).select("email username").lean() as any;
    if (!user?.email) return;

    const subject  = TYPE_SUBJECT[type] ?? "Notification from Lamid";
    const baseUrl  = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const actionUrl = ctaUrl || baseUrl;

    await notificationTransporter.sendMail({
      from: `"Lamid" <${process.env.NOTIFICATION_EMAIL_USER}>`,
      to: user.email,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#0a0a0a;color:#fff;border-radius:12px;">
          <div style="margin-bottom:20px;">
            <span style="color:#2563EB;font-size:20px;font-weight:bold;">Lamid</span>
          </div>
          <h2 style="font-size:18px;font-weight:600;margin-bottom:8px;">${title}</h2>
          <p style="color:#aaa;font-size:14px;line-height:1.6;margin-bottom:24px;">${message}</p>
          <a href="${actionUrl}" style="display:inline-block;background:#2563EB;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
            View on Lamid
          </a>
          <p style="color:#555;font-size:11px;margin-top:32px;">
            You received this because you have an account on Lamid.<br/>
            <a href="${baseUrl}/client?tab=settings" style="color:#666;">Manage notification preferences</a>
          </p>
        </div>`,
    });
  } catch (err) {
    // Email delivery is non-critical — log and continue
    console.error("Notification email failed:", err);
  }
}
