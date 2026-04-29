import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { notificationTransporter } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message)
      return NextResponse.json({ success: false, message: "Name, email, and message are required" }, { status: 400 });

    const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL_USER;

    if (adminEmail) {
      await notificationTransporter.sendMail({
        from: `"Lamid Contact" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: adminEmail,
        replyTo: email,
        subject: `[Contact] ${subject || "New enquiry"} — ${name}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#c12129;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject || "—"}</p>
          <hr/>
          <p style="white-space:pre-wrap;">${message}</p>
        </div>`,
      });

      await notificationTransporter.sendMail({
        from: `"Lamid" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: email,
        subject: "We received your message — Lamid",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
          <h2 style="color:#c12129;">Thanks for reaching out, ${name}!</h2>
          <p>We received your message and will respond within 1 business day.</p>
          <p style="color:#999;font-size:12px;">The Lamid Team · Lagos, Nigeria · London, UK</p>
        </div>`,
      });
    }

    return NextResponse.json({ success: true, message: "Thank you for contacting us. We'll get back to you soon!" });
  } catch (e: any) {
    console.error("Contact form error:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
