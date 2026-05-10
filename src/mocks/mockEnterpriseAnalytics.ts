// mocks/mockEnterpriseAnalytics.ts
import type {
  EnterpriseAnalytics,
  EnterpriseAnalyticsKPI,
  SpendDataPoint,
  CategoryDataPoint,
  ProjectStatusDataPoint,
  MilestoneTrendPoint,
  HiringActivityPoint,
  EscrowActivityPoint,
  ConsultantPerformance,
} from "@/types/enterprise";

export type {
  EnterpriseAnalytics,
  EnterpriseAnalyticsKPI,
  SpendDataPoint,
  CategoryDataPoint,
  ProjectStatusDataPoint,
  MilestoneTrendPoint,
  HiringActivityPoint,
  EscrowActivityPoint,
  ConsultantPerformance,
};

export const mockEnterpriseAnalytics: EnterpriseAnalytics = {
  kpi: {
    totalBudget:         920000,
    totalSpent:          524000,
    totalRemaining:      396000,
    activeProjects:      9,
    completedProjects:   5,
    avgCompletionRate:   94,
    avgProjectDuration:  3.4,
    totalConsultants:    22,
    activeConsultants:   17,
    openDisputes:        2,
    resolvedDisputes:    6,
    totalMilestones:     64,
    completedMilestones: 49,
    memberCount:         38,
    pendingInvites:      4,
  },

  monthlySpend: [
    { month: "Nov", budget: 80000,  spend: 42000  },
    { month: "Dec", budget: 90000,  spend: 67000  },
    { month: "Jan", budget: 95000,  spend: 83000  },
    { month: "Feb", budget: 100000, spend: 89000  },
    { month: "Mar", budget: 110000, spend: 104000 },
    { month: "Apr", budget: 120000, spend: 95000  },
  ],

  categoryData: [
    { category: "Tech",      count: 8, spend: 186000 },
    { category: "Finance",   count: 5, spend: 124000 },
    { category: "Design",    count: 4, spend: 68000  },
    { category: "Marketing", count: 6, spend: 92000  },
    { category: "Legal",     count: 3, spend: 54000  },
    { category: "Data",      count: 7, spend: 141000 },
  ],

  statusBreakdown: [
    { status: "Active",    count: 9,  color: "#3b82f6" },
    { status: "Completed", count: 5,  color: "#22c55e" },
    { status: "Paused",    count: 2,  color: "#eab308" },
    { status: "Disputed",  count: 2,  color: "#ef4444" },
    { status: "Draft",     count: 3,  color: "#6b7280" },
  ],

  milestoneTrend: [
    { month: "Nov", completed: 6,  total: 10 },
    { month: "Dec", completed: 9,  total: 11 },
    { month: "Jan", completed: 8,  total: 10 },
    { month: "Feb", completed: 11, total: 12 },
    { month: "Mar", completed: 9,  total: 11 },
    { month: "Apr", completed: 6,  total: 10 },
  ],

  hiringActivity: [
    { month: "Nov", bids: 18, accepted: 6  },
    { month: "Dec", bids: 24, accepted: 9  },
    { month: "Jan", bids: 31, accepted: 11 },
    { month: "Feb", bids: 27, accepted: 8  },
    { month: "Mar", bids: 35, accepted: 13 },
    { month: "Apr", bids: 29, accepted: 10 },
  ],

  escrowActivity: [
    { month: "Nov", funded: 52000, released: 38000, disputed: 4000  },
    { month: "Dec", funded: 78000, released: 61000, disputed: 7000  },
    { month: "Jan", funded: 91000, released: 74000, disputed: 5000  },
    { month: "Feb", funded: 84000, released: 79000, disputed: 3000  },
    { month: "Mar", funded: 110000,released: 98000, disputed: 8000  },
    { month: "Apr", funded: 95000, released: 82000, disputed: 6000  },
  ],

  topConsultants: [
    { name: "Amara Nwosu",    avatar: "A", projects: 7, avgRating: 4.9, totalPaid: 142000, onTime: 97, specialty: "Tech"      },
    { name: "Dele Okafor",    avatar: "D", projects: 6, avgRating: 4.8, totalPaid: 128000, onTime: 95, specialty: "Finance"   },
    { name: "Priya Sharma",   avatar: "P", projects: 5, avgRating: 5.0, totalPaid: 98000,  onTime: 100,specialty: "Data"      },
    { name: "James Thornton", avatar: "J", projects: 4, avgRating: 4.7, totalPaid: 84000,  onTime: 92, specialty: "Marketing" },
    { name: "Fatima Al-Said", avatar: "F", projects: 4, avgRating: 4.8, totalPaid: 76000,  onTime: 98, specialty: "Legal"     },
    { name: "Chen Wei",       avatar: "C", projects: 3, avgRating: 4.9, totalPaid: 61000,  onTime: 100,specialty: "Design"    },
  ],
};

/* ── Legacy named exports (keep existing imports working) ─── */
export const mockSpendData      = mockEnterpriseAnalytics.monthlySpend;
export const mockCategoryData   = mockEnterpriseAnalytics.categoryData;
export const mockConsultantPerf = mockEnterpriseAnalytics.topConsultants.map(c => ({
  name: c.name, projects: c.projects, rating: c.avgRating, paid: c.totalPaid,
}));
export const mockAnalyticsKPIs = {
  totalSpend:     mockEnterpriseAnalytics.kpi.totalSpent,
  avgProject:     Math.round(mockEnterpriseAnalytics.kpi.totalSpent / (mockEnterpriseAnalytics.kpi.activeProjects + mockEnterpriseAnalytics.kpi.completedProjects)),
  completionRate: mockEnterpriseAnalytics.kpi.avgCompletionRate,
  avgDuration:    mockEnterpriseAnalytics.kpi.avgProjectDuration,
};
