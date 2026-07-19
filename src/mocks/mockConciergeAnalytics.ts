// mocks/mockConciergeAnalytics.ts
import type {
  ConciergeAnalytics,
  ConciergeAnalyticsKPI,
  ConciergeMonthlySpend,
  ConciergeProjectStatusBreakdown,
  ConciergeMilestoneTrend,
  ConciergeTopProject,
} from "@/types/project";

export type {
  ConciergeAnalytics,
  ConciergeAnalyticsKPI,
  ConciergeMonthlySpend,
  ConciergeProjectStatusBreakdown,
  ConciergeMilestoneTrend,
  ConciergeTopProject,
};

export const mockConciergeAnalytics: ConciergeAnalytics = {
  kpi: {
    totalBudget:        572000,
    totalSpent:         318400,
    totalRemaining:     253600,
    activeProjects:     4,
    completedProjects:  2,
    avgProgress:        67,
    totalMilestones:    34,
    completedMilestones:22,
    openDisputes:       1,
    resolvedDisputes:   3,
    teamSize:           11,
  },

  monthlySpend: [
    { month: "Nov", budget: 60000, spent: 41200 },
    { month: "Dec", budget: 65000, spent: 58800 },
    { month: "Jan", budget: 70000, spent: 62400 },
    { month: "Feb", budget: 75000, spent: 54000 },
    { month: "Mar", budget: 80000, spent: 71600 },
    { month: "Apr", budget: 85000, spent: 30400 },
  ],

  statusBreakdown: [
    { status: "Active",    count: 4, color: "#3b82f6" },
    { status: "Completed", count: 2, color: "#22c55e" },
    { status: "Paused",    count: 1, color: "#eab308" },
    { status: "Disputed",  count: 1, color: "#2563EB" },
  ],

  milestoneTrend: [
    { month: "Nov", completed: 3,  total: 6  },
    { month: "Dec", completed: 5,  total: 7  },
    { month: "Jan", completed: 4,  total: 6  },
    { month: "Feb", completed: 6,  total: 7  },
    { month: "Mar", completed: 3,  total: 5  },
    { month: "Apr", completed: 1,  total: 3  },
  ],

  topProjects: [
    { id: "p1", title: "UNDP Community Health Programme",  progress: 68, budget: 85000,  spent: 57800,  status: "active",    pm: "Dr. A. Okafor"   },
    { id: "p2", title: "Federal HR Transformation",        progress: 35, budget: 120000, spent: 42000,  status: "active",    pm: "M. Adeyemi"      },
    { id: "p3", title: "Lagos Smart Logistics Hub",        progress: 82, budget: 95000,  spent: 77900,  status: "active",    pm: "F. Chukwu"       },
    { id: "p4", title: "NGO Governance Reform Initiative", progress: 51, budget: 72000,  spent: 36720,  status: "paused",    pm: "C. Eze"          },
    { id: "p5", title: "Education Tech Scale-up",          progress: 100,budget: 60000,  spent: 59600,  status: "completed", pm: "Dr. A. Okafor"   },
    { id: "p6", title: "Climate Resilience Programme",     progress: 100,budget: 140000, spent: 138200, status: "completed", pm: "B. Nwosu"        },
  ],
};
