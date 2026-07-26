import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { notificationTransporter } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  function escHtml(str: string) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  try {
    await connectDB();
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message)
      return NextResponse.json({ success: false, message: "Name, email, and message are required" }, { status: 400 });

    const safeName    = escHtml(String(name).slice(0, 200));
    const safeEmail   = escHtml(String(email).slice(0, 254));
    const safeSubject = escHtml(String(subject || "").slice(0, 300));
    const safeMessage = escHtml(String(message).slice(0, 5000));

    const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL_USER;

    if (adminEmail) {
      await notificationTransporter.sendMail({
        from: `"Lamid Contact" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: adminEmail,
        replyTo: email,
        subject: `[Contact] ${safeSubject || "New enquiry"} — ${safeName}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#2563EB;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Subject:</strong> ${safeSubject || "—"}</p>
          <hr/>
          <p style="white-space:pre-wrap;">${safeMessage}</p>
        </div>`,
      });

      await notificationTransporter.sendMail({
        from: `"Lamid" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: email,
        subject: "We received your message — Lamid",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
          <h2 style="color:#2563EB;">Thanks for reaching out, ${safeName}!</h2>
          <p>We received your message and will respond within 1 business day.</p>
          <p style="color:#999;font-size:12px;">The LAMID ONE Team</p>
        </div>`,
      });
    }

    return NextResponse.json({ success: true, message: "Thank you for contacting us. We'll get back to you soon!" });
  } catch (e: any) {
    console.error("Contact form error:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
