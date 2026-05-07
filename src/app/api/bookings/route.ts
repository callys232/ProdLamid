import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Profile from "@/lib/models/Profile";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { consultantId, clientId, day, hour, serviceType, notes } = await req.json();

    if (!consultantId || !clientId || !day || hour == null) {
      return NextResponse.json({ message: "consultantId, clientId, day, and hour are required." }, { status: 400 });
    }

    const profile = await Profile.findOne({ user: consultantId });
    if (!profile) return NextResponse.json({ message: "Consultant not found." }, { status: 404 });

    // Check slot is available
    const available = profile.availability?.some(
      (slot: any) => slot.day === day && slot.hour === hour && !slot.booked
    );
    if (!available) {
      return NextResponse.json({ message: "This slot is no longer available." }, { status: 409 });
    }

    // Mark slot as booked
    profile.availability = profile.availability.map((slot: any) =>
      slot.day === day && slot.hour === hour
        ? { ...slot, booked: true, bookedBy: clientId }
        : slot
    );

    // Add to bookings array
    if (!profile.bookings) profile.bookings = [];
    const booking = {
      clientId,
      day,
      hour,
      serviceType: serviceType || "Consultation",
      notes: notes || "",
      status: "confirmed",
      createdAt: new Date(),
    };
    profile.bookings.push(booking);
    await profile.save();

    return NextResponse.json({ message: "Booking confirmed.", booking }, { status: 200 });
  } catch (error) {
    console.error("Booking POST error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const consultantId = searchParams.get("consultantId");
    if (!consultantId) return NextResponse.json({ message: "consultantId required." }, { status: 400 });

    const profile = await Profile.findOne({ user: consultantId }).select("availability bookings");
    return NextResponse.json({
      availability: profile?.availability ?? [],
      bookings: profile?.bookings ?? [],
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
