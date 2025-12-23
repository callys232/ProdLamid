import EventsHeader from "@/components/Events/eventsHeader";
import BusinessPrototypes from "@/components/bizprototype/bizPrototypes";
import Testimonial from "@/components/Testimonial";
import Slider from "../../components/slider";
import EventList from "@/components/Events/EventsList";
import Allevents from "@/components/Events/allEvents";

export default async function EventsPage() {
  return (
    <main>
      <EventsHeader />
      <Allevents />
      <EventList />
      <BusinessPrototypes />
      <Testimonial />
      <Slider />
    </main>
  );
}
