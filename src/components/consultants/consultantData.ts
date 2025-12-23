// consultantData.ts
export interface Consultant {
  id: string;
  name: string;
  industry: string;
  delivery: string;
  rate: string; // Example: "$75"
  rating: number; // 1–5
  image?: string;
  experience?: number; // ✅ Added this
}

export const consultantsData: Consultant[] = [
  {
    id: "1",
    name: "Catalyst",
    industry: "Business Strategy",
    delivery: "Project Delivery",
    rate: "$65",
    rating: 5,
    experience: 5,
    image: "/consultants/catalyst.jpg",
  },
  {
    id: "2",
    name: "VisionPro",
    industry: "Tech & Software",
    delivery: "App Development",
    rate: "$80",
    rating: 4,
    experience: 7,
    image: "/consultants/visionpro.jpg",
  },
  {
    id: "3",
    name: "FinanceEdge",
    industry: "Finance",
    delivery: "Financial Advisory",
    rate: "$70",
    rating: 5,
    experience: 6,
    image: "/consultants/financeedge.jpg",
  },
  {
    id: "4",
    name: "HRBoost",
    industry: "Human Resources",
    delivery: "Recruitment",
    rate: "$60",
    rating: 3,
    experience: 4,
    image: "/consultants/hrboost.jpg",
  },
];
