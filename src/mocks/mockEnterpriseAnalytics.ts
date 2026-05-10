// mocks/mockEnterpriseAnalytics.ts

export interface SpendDataPoint    { month: string; spend: number }
export interface CategoryDataPoint { category: string; count: number }
export interface ConsultantPerf    { name: string; projects: number; rating: number; paid: number }

export const mockSpendData: SpendDataPoint[] = [
  { month: "Nov", spend: 42000 },
  { month: "Dec", spend: 67000 },
  { month: "Jan", spend: 53000 },
  { month: "Feb", spend: 89000 },
  { month: "Mar", spend: 74000 },
  { month: "Apr", spend: 95000 },
];

export const mockCategoryData: CategoryDataPoint[] = [
  { category: "Tech",      count: 8 },
  { category: "Finance",   count: 5 },
  { category: "Design",    count: 4 },
  { category: "Marketing", count: 6 },
  { category: "Legal",     count: 3 },
  { category: "Data",      count: 7 },
];

export const mockConsultantPerf: ConsultantPerf[] = [
  { name: "Amara Nwosu",    projects: 4, rating: 4.9, paid: 88000  },
  { name: "James Thornton", projects: 3, rating: 4.8, paid: 54000  },
  { name: "Priya Sharma",   projects: 2, rating: 5.0, paid: 42000  },
  { name: "Dele Okafor",    projects: 5, rating: 4.7, paid: 110000 },
];

export const mockAnalyticsKPIs = {
  totalSpend:     420000,
  avgProject:     28000,
  completionRate: 94,
  avgDuration:    3.4,
};
