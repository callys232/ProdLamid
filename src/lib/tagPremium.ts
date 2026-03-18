

export type TagLibrary = Record<string, string[]>;


export const TAG_LIBRARY: TagLibrary = {


    Consulting: [
        "Strategy",
        "Market Research",
        "Business Transformation",
        "Startup Advisory",
        "Growth Strategy",
        "Go-to-Market",
        "Competitive Analysis",
        "Product Strategy",
        "Innovation Consulting",
        "Operational Excellence",
        "Change Management",
        "Management Consulting",
        "Digital Transformation",
        "Business Intelligence",
        "Stakeholder Management",
        "Corporate Governance",
    ],

    Business: [
        "Business Planning",
        "Operations",
        "Scaling Strategy",
        "Product Market Fit",
        "Business Development",
        "Sales Strategy",
        "Customer Acquisition",
        "Revenue Optimization",
        "Strategic Partnerships",
        "Market Expansion",
        "Franchise Development",
        "Corporate Structuring",
    ],

    Finance: [
        "Financial Modeling",
        "Investment Strategy",
        "Risk Analysis",
        "Portfolio Management",
        "Financial Forecasting",
        "Capital Raising",
        "Venture Capital",
        "Private Equity",
        "Mergers & Acquisitions",
        "Asset Management",
        "Corporate Finance",
        "Budget Planning",
        "Financial Compliance",
    ],

    "Web 3.0": [
        "Smart Contracts",
        "Blockchain Architecture",
        "Tokenomics",
        "NFT Systems",
        "DAO Governance",
        "Crypto Wallet Integration",
        "DeFi Protocols",
        "Layer 2 Solutions",
        "Solidity",
        "Smart Contract Security",
        "Web3 Frontend",
        "Crypto Payment Systems",
    ],


    Development: [
        "Full Stack Development",
        "Frontend Development",
        "Backend Development",
        "API Development",
        "Microservices",
        "System Architecture",
        "DevOps",
        "CI/CD",
        "Cloud Architecture",
        "Scalable Systems",
        "Database Design",
        "Serverless",
        "Containerization",
    ],

    AI: [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Recommendation Systems",
        "Predictive Analytics",
        "Data Engineering",
        "Data Pipelines",
        "AI Product Design",
        "AI Model Deployment",
        "AI Ethics",
        "Prompt Engineering",
    ],


    Data: [
        "Data Analysis",
        "Data Visualization",
        "Statistical Modeling",
        "Big Data",
        "Data Warehousing",
        "ETL Pipelines",
        "Business Analytics",
        "Dashboard Development",
        "Data Governance",
    ],


    Security: [
        "Cybersecurity",
        "Penetration Testing",
        "Threat Analysis",
        "Vulnerability Assessment",
        "Security Architecture",
        "Identity Management",
        "Cloud Security",
        "Application Security",
        "Security Auditing",
    ],

    Cloud: [
        "AWS",
        "Google Cloud",
        "Azure",
        "Cloud Migration",
        "Infrastructure as Code",
        "Serverless Architecture",
        "Cloud Automation",
        "Kubernetes",
        "Docker",
    ],

    Graphics: [
        "Brand Design",
        "Logo Design",
        "Illustration",
        "UI Design",
        "UX Research",
        "Design Systems",
        "Typography",
        "Motion Graphics",
        "Product Design",
        "Creative Direction",
    ],


    "Video and Animation": [
        "Video Editing",
        "Motion Design",
        "3D Animation",
        "2D Animation",
        "Storyboarding",
        "Visual Effects",
        "Post Production",
        "Cinematography",
    ],


    Games: [
        "Game Design",
        "Level Design",
        "Gameplay Systems",
        "Multiplayer Systems",
        "Unity",
        "Unreal Engine",
        "Game Physics",
        "Game Economy",
    ],


    Marketing: [
        "Digital Marketing",
        "SEO",
        "Content Marketing",
        "Growth Marketing",
        "Email Marketing",
        "Social Media Strategy",
        "Brand Marketing",
        "Marketing Automation",
        "Performance Marketing",
        "Advertising Strategy",
    ],


    Literature: [
        "Content Writing",
        "Technical Writing",
        "Copywriting",
        "Ghostwriting",
        "Story Development",
        "Script Writing",
        "Editing",
        "Publishing Strategy",
    ],


    Entertainment: [
        "Media Production",
        "Creative Production",
        "Talent Management",
        "Event Production",
        "Music Production",
        "Film Production",
    ],


    "Food & Beverages": [
        "Restaurant Strategy",
        "Menu Engineering",
        "Food Branding",
        "Hospitality Management",
        "Food Product Development",
    ],


    "Art and Culture": [
        "Art Direction",
        "Cultural Research",
        "Museum Curation",
        "Creative Strategy",
        "Public Art Projects",
    ],

    default: [
        "Research",
        "Planning",
        "Consulting",
        "Strategy",
        "Documentation",
        "Analysis",
        "Project Management",
    ],
};


export function getTagsForCategory(category?: string): string[] {

    if (!category) return TAG_LIBRARY.default;

    return TAG_LIBRARY[category] ?? TAG_LIBRARY.default;

}


export function validateTag(tag: string, category?: string): boolean {

    const allowedTags = getTagsForCategory(category);

    return allowedTags.includes(tag);

}


export function toggleTagList(
    currentTags: string[],
    tag: string,
    category?: string
): string[] {

    if (!validateTag(tag, category)) return currentTags;

    if (currentTags.includes(tag)) {
        return currentTags.filter((t) => t !== tag);
    }

    return [...currentTags, tag];

}

export function searchTags(query: string): string[] {

    const allTags = Object.values(TAG_LIBRARY).flat();

    const q = query.toLowerCase();

    return allTags.filter((tag) =>
        tag.toLowerCase().includes(q)
    );

}

export function getAllTags(): string[] {

    return Array.from(
        new Set(Object.values(TAG_LIBRARY).flat())
    );

}