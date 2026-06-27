import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Valid email required." }, { status: 400 });
    }

    // TODO: connect to your email provider (Mailchimp, Resend, Nodemailer, etc.)
    // Example: await addToMailingList(email);

    return NextResponse.json({ message: "Subscribed successfully." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
