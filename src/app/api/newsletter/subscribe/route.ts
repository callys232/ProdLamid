// src/app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Lamid Consulting" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Lamid Consulting Newsletter",
      html: `
        <h2>Welcome to Lamid Consulting 🎉</h2>
        <p>Dear Subscriber,</p>
        <p>Thank you for signing up for Lamid Consulting's newsletter. 
        You'll now receive updates on our latest events, insights, and opportunities.</p>
        <p>We’re excited to have you with us!</p>
        <p>Best regards,<br/>Lamid Consulting Team</p>
      `,
    });

    return NextResponse.json({ message: "Subscription successful" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
