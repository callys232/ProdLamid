import { redirect } from "next/navigation";

// /events → /event (canonical singular route)
export default function EventsPage() {
  redirect("/event");
}
