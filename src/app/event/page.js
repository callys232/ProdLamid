import EventsHeader from "@/components/Events/eventsHeader";
import BusinessPrototypes from "@/components/bizprototype/bizPrototypes";
import LamidOneTestimonials from "@/components/lamidOne/LamidOneTestimonials";
import Slider from "../../components/slider";
import EventList from "@/components/Events/EventsList";
import Allevents from "@/components/Events/allEvents";

export default async function EventsPage() {
  return (
    <main>
      <EventsHeader />
      <EventList />
      <Allevents />
      <BusinessPrototypes />
      <LamidOneTestimonials pillar="talent" />
      <Slider />
    </main>
  );
}
