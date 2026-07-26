/**
 * Enterprise Operating Model — Fallback Mock Data
 * Used to display all features when no AI assessment has been run
 * or as a structural reference for the AI response schema.
 */

export interface OperatingArtifact {
  id:          number;
  name:        string;
  translation: string;
  description: string;
  status:      "approved" | "translating" | "pending";
  completionPct: number;
}

export interface LeadershipRole {
  number:      number;
  title:       string;
  system:      string;
  systemCode:  string;
  description: string;
  status:      "active" | "assigned" | "pending";
  isFinalGate?: boolean;
}

export interface GovernanceTier {
  name:        string;
  body:        string;
  icon:        "crown" | "shield" | "compass";
  decisionRights: string[];
  holders:     string[];
  cadence:     string;
  quorum:      string;
  escalation?: string;
}

export interface RolloutPhase {
  number:    number;
  name:      string;
  timeline:  string;
  milestones: string[];
  status:    "complete" | "active" | "pending";
  progress:  number;
}

export interface IntegrationStage {
  number:      number;
  name:        string;
  timeline:    string;
  description: string;
  status:      "complete" | "active" | "pending";
  side:        "left" | "right";
}

export interface ExpansionVector {
  number:    number;
  name:      string;
  subtitle:  string;
  description: string;
  highlight: string;
}

export interface OperationalFramework {
  number:    number;
  name:      string;
  source:    string;
  description: string;
  icon:      "constitution" | "integration" | "governance" | "expansion";
}

export interface GovernanceMilestone {
  quarter:      string;
  year:         string;
  title:        string;
  description:  string;
  details:      string[];
  status:       "initiated" | "scheduled" | "pending" | "complete";
  milestoneNum: number;
}

export interface DecisionType {
  name:        string;
  body:        string;
  icon:        "crown" | "shield" | "compass" | "zap";
  level:       "unanimous" | "quorum" | "individual" | "override";
  description: string;
  color:       string;
}

export interface OperatingModelAssessment {
  enterprise:          OperatingModelEnterpriseProfile;
  commandOverview:     CommandOverviewData;
  artifacts:           OperatingArtifact[];
  leadershipRoles:             LeadershipRole[];
  governanceTiers:     GovernanceTier[];
  rolloutPhases:              RolloutPhase[];
  integrationStages:   IntegrationStage[];
  expansionVectors:    ExpansionVector[];
  frameworks:          OperationalFramework[];
  milestones:          GovernanceMilestone[];
  decisionTypes:       DecisionType[];
  operatingModelScore:   number;
  currentPhase:        string;
  nextAction:          string;
}

export interface OperatingModelEnterpriseProfile {
  name:          string;
  phase:         string;
  status:        string;
  initiatedDate: string;
  approvalStatus:    string;
  industry:      string;
  imperativeStatement: string;
}

export interface CommandOverviewData {
  artifacts:        number;
  artifactsNote:    string;
  governanceTiers:  number;
  governanceNote:   string;
  leadershipRoles:  number;
  roleNote:       string;
  rolloutPhases:      number;
  phaseNote:        string;
}

/* ── Mock Data ─────────────────────────────────────────────── */

export const OPERATING_MODEL_MOCK: OperatingModelAssessment = {

  enterprise: {
    name:          "LAMID ONE",
    phase:         "II",
    status:        "Active",
    initiatedDate: "Q3 2026",
    approvalStatus:    "Approved & Underway",
    industry:      "HumanAI Consulting & Growth",
    imperativeStatement: "Phase II turns the seven Phase I artifacts into working systems. Every framework goes live, every leadership role is bound to the system it owns, and every domain gets a defined rollout date — so authority, reporting, and escalation are documented rather than assumed.",
  },

  commandOverview: {
    artifacts:       7,
    artifactsNote:   "Each Phase I artifact now anchors an active enterprise protocol",
    governanceTiers: 3,
    governanceNote:  "Strategic, Operational, and Tactical authority structures",
    leadershipRoles: 7,
    roleNote:      "Every leadership role is now bound to a designated operational system",
    rolloutPhases:     5,
    phaseNote:       "Sequential multi-domain deployment across the enterprise",
  },

  artifacts: [
    { id: 1, name: "Operating Charter",  translation: "Constitutional Authority Framework",  description: "The top-level governance document, now enacted as binding enterprise policy.",             status: "approved",      completionPct: 100 },
    { id: 2, name: "Coverage Map",       translation: "Domain Integration Protocol",    description: "Domain boundaries codified into system integration architecture.",                        status: "approved",      completionPct: 100 },
    { id: 3, name: "Access Authority Standard",  translation: "Authentication & Access Governance",  description: "Becomes the enterprise identity and access management standard.",                status: "approved",      completionPct: 100 },
    { id: 4, name: "Partner Agreement Protocol",  translation: "Stakeholder Alignment Matrix",        description: "agreement obligations translated into active partner governance agreements.",              status: "translating", completionPct: 74  },
    { id: 5, name: "Role–System Blueprint",   translation: "Leadership–System Architecture",      description: "Leadership Role role definitions hard-wired to enterprise platform assignments.",                  status: "translating", completionPct: 88  },
    { id: 6, name: "Operating Handbook",        translation: "Operational Domain Standards",        description: "The Handbook becomes the operating procedure bible for each domain.",                        status: "translating", completionPct: 61  },
    { id: 7, name: "Expansion Directive",  translation: "Multi-Domain Growth Directive",        description: "The Mandate initiates the five-phase domain rollout sequence — the activation engine of Phase II.", status: "pending", completionPct: 32  },
  ],

  leadershipRoles: [
    { number: 1, title: "Chief Operating Architect",     system: "Enterprise Strategy System",       systemCode: "ESS",  description: "Overall oversight of enterprise direction; ESS provides the command intelligence dashboard.",     status: "active"   },
    { number: 2, title: "Chief Partnerships Officer",  system: "Stakeholder Mgmt Platform",        systemCode: "SMP",  description: "Governs all partner relationships; SMP tracks obligations, timelines, and breach alerts.",       status: "active"   },
    { number: 3, title: "Head of Operations",          system: "Operational Command Center",        systemCode: "OCC",  description: "Directs day-to-day domain operations; OCC aggregates real-time operational telemetry.",           status: "active"   },
    { number: 4, title: "Head of Operating Standards",      system: "Knowledge Management System",       systemCode: "KMS",  description: "Custodian of all documented operating standards; KMS is the living Handbook repository.",               status: "assigned" },
    { number: 5, title: "Head of Integration",   system: "Enterprise Integration Bus",        systemCode: "EIB",  description: "Manages cross-system data flows and API governance; EIB is the connectivity spine.",              status: "active"   },
    { number: 6, title: "Head of Expansion",    system: "Growth Intelligence Platform",      systemCode: "GIP",  description: "Leads multi-domain expansion; GIP models market entry and activation ROI.",              status: "assigned" },
    { number: 7, title: "Head of Access & Identity",           system: "Identity & Access Management System",systemCode: "IAMS", description: "Controls all authentication, authorization, and access-controlled access gates across the Enterprise Operating Model.", status: "active", isFinalGate: true },
  ],

  governanceTiers: [
    {
      name:  "Strategic Tier",
      body:  "Executive Council",
      icon:  "crown",
      decisionRights: ["Enterprise-wide mandates", "Artifact ratification", "Domain boundary declarations", "Partnership & agreement approval"],
      holders:  ["Chief Operating Architect", "Domain Directors"],
      cadence:  "Quarterly Executive Review Session",
      quorum:   "Unanimous Council vote",
    },
    {
      name:  "Operational Tier",
      body:  "Domain Leads",
      icon:  "shield",
      decisionRights: ["System configuration mandates", "Team deployment orders", "Protocol execution directives", "Cross-domain integration approvals"],
      holders:  ["Domain Leads", "Integration Leads"],
      cadence:  "Monthly Domain Synchronisation",
      quorum:   "2/3 Domain Lead agreement",
      escalation: "Elevates to Strategic Tier on deadlock",
    },
    {
      name:  "Tactical Tier",
      body:  "Domain Operators",
      icon:  "compass",
      decisionRights: ["Day-to-day domain execution", "Local protocol deployment", "Immediate operational decisions"],
      holders:  ["Domain Operators"],
      cadence:  "Continuous — 48h escalation threshold",
      quorum:   "Individual authority",
      escalation: "Escalates to Operational Tier within 48 hours",
    },
  ],

  rolloutPhases: [
    { number: 1, name: "Foundation Phase",  timeline: "Months 1–2",  status: "complete", progress: 100, milestones: ["Constitutional governance structures deployed & Charter protocols enacted", "Access Authority Standard formally activated across enterprise", "All seven leadership roles formally assigned"] },
    { number: 2, name: "Agreements Phase",    timeline: "Months 2–3",  status: "active",   progress: 68,  milestones: ["Stakeholder agreement execution & partner alignment protocols activated", "Partnerships Officer deploys SMP across all enterprise relationships", "Obligation tracking & breach alert systems operational"] },
    { number: 3, name: "Integration Phase", timeline: "Months 3–5",  status: "pending",  progress: 24,  milestones: ["Cross-system connectivity established via Enterprise Integration Bus", "EIB fully operational — all API governance frameworks live", "All seven role–system pairs transmitting live data"] },
    { number: 4, name: "Expansion Phase",   timeline: "Months 5–8",  status: "pending",  progress: 0,   milestones: ["New domain rollout initiated & GIP projections activated", "Market entry protocols engaged by Head of Expansion", "Growth blueprints deployed across target domains"] },
    { number: 5, name: "Full Operation Phase",   timeline: "Months 8–12", status: "pending",  progress: 0,   milestones: ["Full multi-domain operational coverage achieved across all domains", "All governance tiers active — continuous expansion cycle self-sustaining", "Enterprise Operating Model declared fully operational"] },
  ],

  integrationStages: [
    { number: 1, name: "Artifact Ratification",   timeline: "Weeks 1–3",  description: "Formally validate all seven Phase I artifacts. Establish baseline versions. Archive in KMS. Obtain Executive Council ratification.", status: "complete", side: "left"  },
    { number: 2, name: "System Onboarding",        timeline: "Weeks 4–7",  description: "Map each artifact to its primary enterprise system. Configure integration endpoints. Assign role–system owners. Document data flow diagrams.", status: "active",   side: "right" },
    { number: 3, name: "Governance Activation",    timeline: "Weeks 8–10", description: "Activate decision matrices and oversight protocols. Convene first Executive Council Review. Issue governance activation notice.", status: "pending",  side: "left"  },
    { number: 4, name: "Integration Testing",       timeline: "Weeks 11–14",description: "Cross-system validation, end-to-end data flow testing, agreement compliance audits, and access authentication stress tests.", status: "pending",  side: "right" },
    { number: 5, name: "Full Operational Deployment",timeline: "Weeks 15+", description: "All role–system pairs go live. Continuous governance monitoring enabled. Domain activation sequence commences.", status: "pending",  side: "left"  },
  ],

  expansionVectors: [
    { number: 1, name: "Horizontal Domain Expansion", subtitle: "Vector I",  description: "Lateral acquisition of new operational domains. Each new domain follows the Operating Handbook onboarding protocol before activation.", highlight: "Target: 3 new domains per expansion cycle." },
    { number: 2, name: "Vertical Integration Depth",  subtitle: "Vector II", description: "Deepening operating model control within existing rolloutPhases. Extends governance reach from strategic to ground-level operations.", highlight: "Eliminates authority gaps and integration blind spots." },
    { number: 3, name: "Alliance Protocol Network",   subtitle: "Vector III",description: "Multi-enterprise partnership agreements governed by the Partner Agreement Protocol. External partners become contractually bound participants.", highlight: "Alliance governance matrices defined per partner." },
    { number: 4, name: "Digital Domain Ownership",   subtitle: "Vector IV", description: "Technology-driven domain creation. New digital territories governed from day one by Enterprise Operating Model principles.", highlight: "AI, automation, and data rolloutPhases included." },
  ],

  frameworks: [
    { number: 1, name: "Constitutional Operating Framework", source: "Operating Charter",                     description: "Defines the non-negotiable rules of enterprise engagement: decision rights, authority chains, veto powers, and constitutional amendments. No operational action may override it.", icon: "constitution" },
    { number: 2, name: "Integration & Mapping Framework",    source: "Coverage Map + Role–System Blueprint",       description: "Defines how every leadership role, system node, and data flow connects across the enterprise topology. The connective architecture binding every domain to every system.", icon: "integration"  },
    { number: 3, name: "Governance & Accountability Framework", source: "Partner Agreement Protocol + Access Authority Standard", description: "Establishes the accountability ladder, audit protocols, agreement enforcement, and access-controlled authorization gates. Every decision is traceable; every authority is bounded and verified.", icon: "governance"   },
    { number: 4, name: "Expansion & Activation Framework",   source: "Operating Handbook + Expansion Directive",      description: "Governs multi-domain activation cadence, new domain onboarding, and expansion protocols. The engine that transforms the Directive from declaration into operational rollout.", icon: "expansion"    },
  ],

  milestones: [
    { milestoneNum: 1, quarter: "Q3", year: "2026", title: "Artifact-to-Framework Translation Complete", description: "All 7 artifacts ratified and mapped. Four operational frameworks documented and approved by Executive Council. KMS fully populated.", details: ["All 7 artifacts ratified and mapped", "Four operational frameworks documented and approved", "KMS fully populated"], status: "initiated"  },
    { milestoneNum: 2, quarter: "Q4", year: "2026", title: "Leadership Role-to-System Mapping Operational",       description: "All 7 leadership roles formally bound to enterprise systems. Integration Bus live. First Executive Council Review conducted.", details: ["All 7 leadership roles formally bound to enterprise systems", "Integration Bus live", "First Executive Council Review conducted"], status: "scheduled"  },
    { milestoneNum: 3, quarter: "Q1", year: "2027", title: "Multi-Domain Activation Sequence Initiated",  description: "Phases I–III activated. Agreements Phase fully operational. Integration testing complete. Head of Expansion briefed and deployed.", details: ["Phases I–III activated", "Agreements Phase fully operational", "Head of Expansion briefed and deployed"], status: "pending"    },
    { milestoneNum: 4, quarter: "Q2", year: "2027", title: "Full Operating Model Operational Governance Achieved", description: "All 5 rolloutPhases active. Expansion Blueprint executing. Continuous governance cycle self-sustaining. Enterprise Operating Model declared complete.", details: ["All 5 rolloutPhases active", "Expansion Blueprint executing", "Enterprise Operating Model declared complete"], status: "complete"   },
  ],

  decisionTypes: [
    { name: "Strategic Decisions",  body: "Executive Council",  icon: "crown",   level: "unanimous", description: "Unanimous vote required. Affects enterprise-wide direction, artifact amendments, and domain boundary changes. No override except by Chief Operating Architect invoking emergency override authority.", color: "#C9A84C" },
    { name: "Operational Decisions",body: "Domain Leads", icon: "shield",  level: "quorum",    description: "2/3 quorum required. Covers system configurations, deployment mandates, and cross-domain integration approvals. Escalates to Strategic if deadlocked for 72+ hours.", color: "#7B9EC9" },
    { name: "Tactical Decisions",   body: "Domain Operators",   icon: "compass", level: "individual",description: "Individual authority. Day-to-day domain execution and local protocol deployment. Escalates to Operational Tier within 48 hours of unresolved issues.", color: "#7BC98C" },
    { name: "Emergency Protocol",   body: "Head of Access & Identity",     icon: "zap",     level: "override",  description: "Head of Access & Identity may invoke override authority during security breaches, agreement breaches, or systemic failures. Immediate Executive notification required.", color: "#C97B7B" },
  ],

  operatingModelScore: 47,
  currentPhase:      "Foundation → Agreements Phase Transition",
  nextAction:        "Complete Partner Agreement Protocol deployment — activate SMP across all enterprise relationships before advancing to Integration Phase",
};
