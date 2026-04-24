export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  avgRate: number;
  jobCount: number;
  trending: boolean;
  color: string;
}

export const mockCategories: JobCategory[] = [
  {
    id: "cat-01", name: "Technology & Software", slug: "technology",
    icon: "💻", description: "Full-stack, mobile, cloud, DevOps, and software architecture.",
    avgRate: 95, jobCount: 142, trending: true, color: "#3b82f6",
  },
  {
    id: "cat-02", name: "Finance & Accounting", slug: "finance",
    icon: "📊", description: "CFO services, financial modelling, auditing, and M&A advisory.",
    avgRate: 120, jobCount: 87, trending: true, color: "#10b981",
  },
  {
    id: "cat-03", name: "Design & Creative", slug: "design",
    icon: "🎨", description: "UI/UX, brand identity, motion graphics, and product design.",
    avgRate: 70, jobCount: 116, trending: true, color: "#f59e0b",
  },
  {
    id: "cat-04", name: "Marketing & Growth", slug: "marketing",
    icon: "📣", description: "Performance marketing, SEO, content strategy, and demand gen.",
    avgRate: 80, jobCount: 98, trending: false, color: "#ec4899",
  },
  {
    id: "cat-05", name: "Legal & Compliance", slug: "legal",
    icon: "⚖️", description: "Contract drafting, regulatory compliance, IP, and corporate law.",
    avgRate: 140, jobCount: 54, trending: false, color: "#6366f1",
  },
  {
    id: "cat-06", name: "Operations & Strategy", slug: "operations",
    icon: "⚙️", description: "Process optimisation, OKR frameworks, supply chain, and scaling.",
    avgRate: 110, jobCount: 73, trending: true, color: "#f97316",
  },
  {
    id: "cat-07", name: "Data & Analytics", slug: "data",
    icon: "🔬", description: "Data science, BI dashboards, ML pipelines, and data engineering.",
    avgRate: 105, jobCount: 129, trending: true, color: "#06b6d4",
  },
  {
    id: "cat-08", name: "Human Resources", slug: "hr",
    icon: "👥", description: "Talent acquisition, org design, culture transformation, and HRIS.",
    avgRate: 75, jobCount: 61, trending: false, color: "#84cc16",
  },
  {
    id: "cat-09", name: "Healthcare & Biotech", slug: "healthcare",
    icon: "🏥", description: "Health IT, clinical consulting, regulatory affairs, and MedTech.",
    avgRate: 130, jobCount: 45, trending: false, color: "#14b8a6",
  },
  {
    id: "cat-10", name: "Real Estate & Construction", slug: "real-estate",
    icon: "🏗️", description: "Project management, quantity surveying, urban planning, and PropTech.",
    avgRate: 90, jobCount: 38, trending: false, color: "#a16207",
  },
  {
    id: "cat-11", name: "Education & Training", slug: "education",
    icon: "🎓", description: "Curriculum design, e-learning, corporate training, and edtech.",
    avgRate: 60, jobCount: 52, trending: false, color: "#7c3aed",
  },
  {
    id: "cat-12", name: "Entertainment & Media", slug: "entertainment",
    icon: "🎬", description: "Content production, streaming platforms, and media strategy.",
    avgRate: 65, jobCount: 67, trending: true, color: "#be185d",
  },
  {
    id: "cat-13", name: "Food & Beverages", slug: "food",
    icon: "🍽️", description: "Restaurant tech, supply chain, nutrition apps, and F&B platforms.",
    avgRate: 55, jobCount: 44, trending: false, color: "#d97706",
  },
  {
    id: "cat-14", name: "Art & Culture", slug: "art",
    icon: "🖼️", description: "Digital art, cultural platforms, museums, and creative tech.",
    avgRate: 50, jobCount: 39, trending: false, color: "#9333ea",
  },
  {
    id: "cat-15", name: "Web 3.0 & Blockchain", slug: "web3",
    icon: "⛓️", description: "Smart contracts, DeFi, NFT platforms, DAO tooling, and tokenomics.",
    avgRate: 150, jobCount: 83, trending: true, color: "#0ea5e9",
  },
  {
    id: "cat-16", name: "Games & Interactive", slug: "games",
    icon: "🎮", description: "Game development, UX, narrative design, and gamification.",
    avgRate: 80, jobCount: 71, trending: true, color: "#22c55e",
  },
  {
    id: "cat-17", name: "Video & Animation", slug: "video",
    icon: "🎥", description: "Motion design, 3D animation, VFX, and video production.",
    avgRate: 65, jobCount: 58, trending: false, color: "#ef4444",
  },
  {
    id: "cat-18", name: "Literature & Content", slug: "literature",
    icon: "✍️", description: "Copywriting, ghostwriting, technical writing, and editorial.",
    avgRate: 45, jobCount: 93, trending: false, color: "#78716c",
  },
  {
    id: "cat-19", name: "Business Development", slug: "business",
    icon: "🚀", description: "Sales strategy, partnerships, market entry, and B2B growth.",
    avgRate: 100, jobCount: 76, trending: true, color: "#c2410c",
  },
  {
    id: "cat-20", name: "Sustainability & ESG", slug: "sustainability",
    icon: "🌱", description: "ESG reporting, carbon strategy, circular economy, and impact investing.",
    avgRate: 115, jobCount: 34, trending: true, color: "#16a34a",
  },
];

export const categoryBySlug = Object.fromEntries(
  mockCategories.map((c) => [c.slug, c])
);

export const trendingCategories = mockCategories.filter((c) => c.trending);
