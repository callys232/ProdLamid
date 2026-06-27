// mocks/mockConciergeReports.ts

export interface ConciergeReport {
  id: string;
  title: string;
  date: string;
  type: string;
  size: string;
  downloadUrl?: string;
}

export interface ConciergeKPI {
  label: string;
  value: string;
  key: string;
}

export const mockConciergeReports: ConciergeReport[] = [
  { id: "rpt-001", title: "Q2 2026 Executive Summary",       date: "1 Jun 2026",  type: "Quarterly",  size: "2.4 MB" },
  { id: "rpt-002", title: "UNDP Programme Impact Report",    date: "15 May 2026", type: "Impact",     size: "5.1 MB" },
  { id: "rpt-003", title: "Gender Equality Initiative KPIs", date: "30 Apr 2026", type: "KPI Report", size: "1.8 MB" },
  { id: "rpt-004", title: "HR Transformation Progress",      date: "1 Apr 2026",  type: "Progress",   size: "3.2 MB" },
];

export const mockConciergeKPIs: ConciergeKPI[] = [
  { key: "completion_rate",      label: "Project Completion Rate", value: "94%"    },
  { key: "total_beneficiaries",  label: "Total Beneficiaries",     value: "12,400" },
  { key: "budget_utilisation",   label: "Budget Utilisation",      value: "81%"    },
  { key: "consultant_sat",       label: "Consultant Satisfaction", value: "4.8/5"  },
];
