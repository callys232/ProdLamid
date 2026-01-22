import EventsHeader from "@/components/Events/eventsHeader";
import BusinessPrototypes from "@/components/bizprototype/bizPrototypes";
import Testimonial from "@/components/Testimonial";
import Slider from "../../components/slider";
import EventList from "@/components/Events/EventsList";
import Allevents from "@/components/Events/allEvents";
import Color from "@/components/ColorLegder";

export default async function EventsPage() {
  return (
    <main>
      <EventsHeader />
      <EventList />
      <Allevents />
      <BusinessPrototypes />
      <Color />
      <Testimonial />
      <Slider />
    </main>
  );
}
