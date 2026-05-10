// mocks/mockConciergePM.ts

export interface PMScheduleSlot {
  day: string;
  slots: string[];
}

export interface PMProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  availability: string;
  specialties: string[];
  rating: number;
  projectsManaged: number;
  yearsExperience: number;
  currentProjects: string[];
  nextCheckIn: string;
  schedule: PMScheduleSlot[];
}

export const mockConciergePM: PMProfile = {
  id: "lamid-pm-001",
  name: "Dr. Amaka Okafor",
  title: "Senior Consultant & Dedicated PM",
  email: "a.okafor@lamidconsulting.com",
  phone: "+234 801 234 5678",
  availability: "Mon–Fri, 8am–6pm WAT",
  specialties: ["Sustainable Development", "NGO Strategy", "Government Relations", "Programme Management"],
  rating: 4.9,
  projectsManaged: 47,
  yearsExperience: 12,
  currentProjects: ["UNDP Community Health Programme", "Gender Equality Initiative — Lagos"],
  nextCheckIn: "Thursday, 12 June 2026 — 10:00 AM WAT",
  schedule: [
    { day: "Mon", slots: ["10:00", "14:00"] },
    { day: "Tue", slots: ["09:00", "11:00", "15:00"] },
    { day: "Wed", slots: ["10:00"] },
    { day: "Thu", slots: ["09:00", "13:00", "16:00"] },
    { day: "Fri", slots: ["10:00", "14:00"] },
  ],
};
