import type { EventItem } from "@/types/eventTypes";

export const mockEvents: EventItem[] = [
  // --- Job Scoping ---
  {
    id: 1,
    title: "Leadership Summit 2026",
    description:
      "A gathering of industry leaders to discuss innovation, leadership strategies, and future opportunities.",
    image: "/images/leadership-summit.jpg",
    images: [
      {
        path: "/images/leadership-summit.jpg",
        alt: "Leadership Summit main hall",
      },
      { path: "/images/leadership-panel.jpg", alt: "Panel discussion" },
    ],
    date: "Jan 12, 2026",
    time: "10:00 AM",
    location: "Abuja",
    category: "Job Scoping",
  },
  {
    id: 2,
    title: "Tech Innovation Conference",
    description:
      "Exploring emerging technologies and their impact on African markets, with keynote speakers from global firms.",
    image: "/images/tech-conference.jpg",
    images: [
      { path: "/images/tech-conference.jpg", alt: "Conference keynote" },
      { path: "/images/tech-expo.jpg", alt: "Tech expo booths" },
    ],
    date: "Mar 20, 2026",
    time: "9:00 AM",
    location: "Port Harcourt",
    category: "Job Scoping",
  },
  {
    id: 3,
    title: "Healthcare Job Scoping",
    description: "Identifying new opportunities in telemedicine and biotech.",
    image: "/images/job-scoping-health.jpg",
    images: [
      { path: "/images/job-scoping-health.jpg", alt: "Healthcare panel" },
    ],
    date: "Apr 15, 2026",
    time: "1:00 PM",
    location: "Lagos",
    category: "Job Scoping",
  },

  // --- Disappearing Jobs ---
  {
    id: 4,
    title: "Human Capital Development Forum",
    description:
      "Strategies for workforce development, employee engagement, and organizational transformation.",
    image: "/images/hcd-forum.jpg",
    images: [
      { path: "/images/hcd-forum.jpg", alt: "Forum audience" },
      { path: "/images/hcd-panel.jpg", alt: "Panel discussion on HR" },
    ],
    date: "Apr 10, 2026",
    time: "11:00 AM",
    location: "Kano",
    category: "Disappearing Jobs",
  },
  {
    id: 5,
    title: "Jobs at Risk: Automation Impact",
    description: "Discussing roles likely to disappear due to automation.",
    image: "/images/disappearing-automation.jpg",
    images: [
      { path: "/images/disappearing-automation.jpg", alt: "Automation impact" },
    ],
    date: "May 2, 2026",
    time: "3:00 PM",
    location: "Abuja",
    category: "Disappearing Jobs",
  },
  {
    id: 6,
    title: "Retail Jobs in Transition",
    description: "How e-commerce is reshaping traditional retail employment.",
    image: "/images/disappearing-retail.jpg",
    images: [
      { path: "/images/disappearing-retail.jpg", alt: "Retail transition" },
    ],
    date: "Jun 18, 2026",
    time: "12:00 PM",
    location: "Lagos",
    category: "Disappearing Jobs",
  },

  // --- Reskilling ---
  {
    id: 7,
    title: "Business Growth Workshop",
    description:
      "Hands-on training for entrepreneurs focusing on scaling businesses and leveraging digital tools.",
    image: "/images/business-workshop.jpg",
    images: [
      { path: "/images/business-workshop.jpg", alt: "Workshop session" },
      { path: "/images/business-networking.jpg", alt: "Networking event" },
    ],
    date: "Feb 5, 2026",
    time: "2:00 PM",
    location: "Lagos",
    category: "Reskilling",
  },
  {
    id: 8,
    title: "Reskilling for Digital Literacy",
    description: "Helping workers adapt to digital-first workplaces.",
    image: "/images/reskilling-digital.jpg",
    images: [
      { path: "/images/reskilling-digital.jpg", alt: "Digital training" },
    ],
    date: "Jul 10, 2026",
    time: "9:00 AM",
    location: "Abuja",
    category: "Reskilling",
  },
  {
    id: 9,
    title: "Green Jobs Reskilling Workshop",
    description: "Training for renewable energy and sustainability careers.",
    image: "/images/reskilling-green.jpg",
    images: [
      { path: "/images/reskilling-green.jpg", alt: "Green jobs workshop" },
    ],
    date: "Aug 22, 2026",
    time: "1:00 PM",
    location: "Port Harcourt",
    category: "Reskilling",
  },
];
