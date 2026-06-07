import { NextRequest, NextResponse } from "next/server";
import { notificationTransporter } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const { email, whatsapp, name } = await request.json();

    if (!email || !whatsapp) {
      return NextResponse.json(
        { success: false, message: "Email and WhatsApp number are required" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL_USER;

    if (adminEmail) {
      // Notify admin
      await notificationTransporter.sendMail({
        from: `"BIZPHERE Waitlist" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: adminEmail,
        subject: `[BIZPHERE] New Waitlist Signup — ${name || email}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:10px;">
            <div style="border-left:4px solid #c21219;padding-left:16px;margin-bottom:20px;">
              <h2 style="color:#c21219;margin:0;">New BIZPHERE Waitlist Entry</h2>
              <p style="color:#666;margin:4px 0 0;">Someone just joined the waitlist</p>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#888;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${name || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;font-weight:600;"><a href="mailto:${email}" style="color:#c21219;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#888;">WhatsApp</td><td style="padding:8px 0;font-weight:600;">${whatsapp}</td></tr>
            </table>
          </div>
        `,
      });

      // Confirm to user
      await notificationTransporter.sendMail({
        from: `"BIZPHERE by LAMID" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: email,
        subject: "You're on the BIZPHERE waitlist!",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:0;background:#0a0a0a;border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#c21219,#8b0f14);padding:32px 28px;">
              <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:0.05em;">BIZPHERE</h1>
              <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">it's all about business</p>
            </div>
            <div style="padding:32px 28px;background:#111;">
              <h2 style="color:#fff;margin:0 0 12px;">You're in${name ? `, ${name.split(" ")[0]}` : ""}!</h2>
              <p style="color:#ccc;line-height:1.7;margin:0 0 20px;">
                You've successfully joined the <strong style="color:#f87171;">BIZPHERE</strong> waitlist — the exclusive small business online networking marketplace where sellers meet buyers.
              </p>
              <p style="color:#ccc;line-height:1.7;margin:0 0 28px;">
                We'll reach out to you on WhatsApp (<strong style="color:#fff;">${whatsapp}</strong>) or email as soon as early access opens. Stay close — the ecosystem is almost ready.
              </p>
              <div style="border-top:1px solid #222;padding-top:20px;margin-top:4px;">
                <p style="color:#555;font-size:12px;margin:0;">
                  One ecosystem, Every layer of impact · <a href="https://lamid.io" style="color:#c21219;text-decoration:none;">lamid.io</a>
                </p>
              </div>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: "You're on the waitlist!" });
  } catch (e: any) {
    console.error("Waitlist error:", e);
    return NextResponse.json({ success: false, message: "Something went wrong. Try again." }, { status: 500 });
  }
}
