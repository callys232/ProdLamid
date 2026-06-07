import { NextRequest, NextResponse } from "next/server";
import { notificationTransporter } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, whatsapp, service, challenge } = await request.json();

    if (!name || !email || !whatsapp || !challenge) {
      return NextResponse.json(
        { success: false, message: "Name, email, WhatsApp, and challenge are required" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL_USER;

    if (adminEmail) {
      // Notify admin
      await notificationTransporter.sendMail({
        from: `"BIZPHERE Advisor" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: adminEmail,
        subject: `[BIZPHERE] Advisor Request — ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:10px;">
            <div style="border-left:4px solid #3b82f6;padding-left:16px;margin-bottom:20px;">
              <h2 style="color:#3b82f6;margin:0;">New Advisor Request</h2>
              <p style="color:#666;margin:4px 0 0;">Someone is requesting a free business diagnostic</p>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#888;width:160px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;font-weight:600;"><a href="mailto:${email}" style="color:#3b82f6;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#888;">WhatsApp</td><td style="padding:8px 0;font-weight:600;">${whatsapp}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Service Interest</td><td style="padding:8px 0;font-weight:600;">${service || "Not specified"}</td></tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:#f9f9f9;border-radius:8px;border-left:3px solid #e5e7eb;">
              <p style="margin:0;color:#555;font-size:13px;font-weight:600;">Their Challenge:</p>
              <p style="margin:8px 0 0;color:#333;white-space:pre-wrap;">${challenge}</p>
            </div>
          </div>
        `,
      });

      // Confirm to user
      await notificationTransporter.sendMail({
        from: `"LAMID Consulting" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: email,
        subject: "Your advisor request is received — LAMID",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:0;background:#0a0a0a;border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#1d4ed8,#1e3a8a);padding:32px 28px;">
              <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:0.04em;">LAMID Consulting</h1>
              <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Business Advisory Services</p>
            </div>
            <div style="padding:32px 28px;background:#111;">
              <h2 style="color:#fff;margin:0 0 12px;">We received your request, ${name.split(" ")[0]}!</h2>
              <p style="color:#ccc;line-height:1.7;margin:0 0 16px;">
                One of our expert advisors will review your details and reach out to you via WhatsApp (<strong style="color:#fff;">${whatsapp}</strong>) or email within <strong style="color:#93c5fd;">1 business day</strong>.
              </p>
              ${service ? `<p style="color:#ccc;line-height:1.7;margin:0 0 20px;">Service area: <strong style="color:#60a5fa;">${service}</strong></p>` : ""}
              <div style="border-top:1px solid #222;padding-top:20px;margin-top:8px;">
                <p style="color:#555;font-size:12px;margin:0;">
                  One ecosystem, Every layer of impact · <a href="https://lamid.io" style="color:#3b82f6;text-decoration:none;">lamid.io</a>
                </p>
              </div>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: "Advisor request received!" });
  } catch (e: any) {
    console.error("Advisor request error:", e);
    return NextResponse.json({ success: false, message: "Something went wrong. Try again." }, { status: 500 });
  }
}
