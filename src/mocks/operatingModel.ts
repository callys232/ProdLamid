/**
 * Sovereign Architecture — Fallback Mock Data
 * Used to display all features when no AI assessment has been run
 * or as a structural reference for the AI response schema.
 */

export interface SovereignArtifact {
  id:          number;
  name:        string;
  translation: string;
  description: string;
  status:      "sealed" | "translating" | "pending";
  completionPct: number;
}

export interface ThronePosition {
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

export interface RealmPhase {
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

export interface SovereignAssessment {
  enterprise:          SovereignEnterpriseProfile;
  commandOverview:     CommandOverviewData;
  artifacts:           SovereignArtifact[];
  thrones:             ThronePosition[];
  governanceTiers:     GovernanceTier[];
  realms:              RealmPhase[];
  integrationStages:   IntegrationStage[];
  expansionVectors:    ExpansionVector[];
  frameworks:          OperationalFramework[];
  milestones:          GovernanceMilestone[];
  decisionTypes:       DecisionType[];
  soverignSealScore:   number;
  currentPhase:        string;
  nextAction:          string;
}

export interface SovereignEnterpriseProfile {
  name:          string;
  phase:         string;
  status:        string;
  initiatedDate: string;
  sealStatus:    string;
  industry:      string;
  imperativeStatement: string;
}

export interface CommandOverviewData {
  artifacts:        number;
  artifactsNote:    string;
  governanceTiers:  number;
  governanceNote:   string;
  thronePositions:  number;
  throneNote:       string;
  realmPhases:      number;
  realmNote:        string;
}

/* ── Mock Data ─────────────────────────────────────────────── */

export const SOVEREIGN_MOCK: SovereignAssessment = {

  enterprise: {
    name:          "LAMID ONE",
    phase:         "II",
    status:        "Active",
    initiatedDate: "Q3 2026",
    sealStatus:    "Sealed & Initiated",
    industry:      "HumanAI Consulting & Growth",
    imperativeStatement: "Phase II does not merely build systems — it consecrates a living architecture of authority, intelligence, and expansion. Every framework activated, every throne mapped, every realm awakened is another declaration that this enterprise does not follow order — it defines it.",
  },

  commandOverview: {
    artifacts:       7,
    artifactsNote:   "Each Phase I artifact now anchors an active enterprise protocol",
    governanceTiers: 3,
    governanceNote:  "Strategic, Operational, and Tactical authority structures",
    thronePositions: 7,
    throneNote:      "Every throne role is now bound to a designated operational system",
    realmPhases:     5,
    realmNote:       "Sequential multi-realm deployment across the enterprise",
  },

  artifacts: [
    { id: 1, name: "Sovereign Charter",  translation: "Constitutional Authority Framework",  description: "The supreme governance document, now enacted as enterprise constitutional law.",             status: "sealed",      completionPct: 100 },
    { id: 2, name: "Dominion Map",       translation: "Territorial Integration Protocol",    description: "Domain boundaries codified into system integration architecture.",                        status: "sealed",      completionPct: 100 },
    { id: 3, name: "Seal of Authority",  translation: "Authentication & Access Governance",  description: "The Seal becomes the enterprise identity and access management standard.",                status: "sealed",      completionPct: 100 },
    { id: 4, name: "Covenant Protocol",  translation: "Stakeholder Alignment Matrix",        description: "Covenant obligations translated into active partner governance agreements.",              status: "translating", completionPct: 74  },
    { id: 5, name: "Throne Blueprint",   translation: "Leadership–System Architecture",      description: "Throne role definitions hard-wired to enterprise platform assignments.",                  status: "translating", completionPct: 88  },
    { id: 6, name: "Realm Codex",        translation: "Operational Domain Standards",        description: "The Codex becomes the operating procedure bible for each domain.",                        status: "translating", completionPct: 61  },
    { id: 7, name: "Expansion Mandate",  translation: "Multi-Realm Growth Directive",        description: "The Mandate initiates the five-phase realm conquest sequence — the activation engine of Phase II.", status: "pending", completionPct: 32  },
  ],

  thrones: [
    { number: 1, title: "Sovereign Architect",     system: "Enterprise Strategy System",       systemCode: "ESS",  description: "Supreme oversight of enterprise direction; ESS provides the command intelligence dashboard.",     status: "active"   },
    { number: 2, title: "Chief Covenant Officer",  system: "Stakeholder Mgmt Platform",        systemCode: "SMP",  description: "Governs all covenant relationships; SMP tracks obligations, timelines, and breach alerts.",       status: "active"   },
    { number: 3, title: "Domain Marshal",          system: "Operational Command Center",        systemCode: "OCC",  description: "Directs day-to-day domain operations; OCC aggregates real-time operational telemetry.",           status: "active"   },
    { number: 4, title: "Realm Codex Keeper",      system: "Knowledge Management System",       systemCode: "KMS",  description: "Custodian of all codified operational wisdom; KMS is the living Codex repository.",               status: "assigned" },
    { number: 5, title: "Integration Commander",   system: "Enterprise Integration Bus",        systemCode: "EIB",  description: "Manages cross-system data flows and API governance; EIB is the connectivity spine.",              status: "active"   },
    { number: 6, title: "Expansion Chancellor",    system: "Growth Intelligence Platform",      systemCode: "GIP",  description: "Leads multi-realm expansion; GIP models territory acquisition and activation ROI.",              status: "assigned" },
    { number: 7, title: "Seal Guardian",           system: "Identity & Access Management System",systemCode: "IAMS", description: "Controls all authentication, authorization, and Seal-based access gates across the Sovereign Architecture.", status: "active", isFinalGate: true },
  ],

  governanceTiers: [
    {
      name:  "Strategic Tier",
      body:  "Sovereign Council",
      icon:  "crown",
      decisionRights: ["Enterprise-wide mandates", "Artifact ratification", "Realm boundary declarations", "Treaty & covenant approval"],
      holders:  ["Sovereign Architect", "Chief Realm Officers"],
      cadence:  "Quarterly Sovereign Review Session",
      quorum:   "Unanimous Council vote",
    },
    {
      name:  "Operational Tier",
      body:  "Domain Lords",
      icon:  "shield",
      decisionRights: ["System configuration mandates", "Team deployment orders", "Protocol execution directives", "Cross-domain integration approvals"],
      holders:  ["Domain Commanders", "Integration Leads"],
      cadence:  "Monthly Domain Synchronisation",
      quorum:   "2/3 Domain Commander agreement",
      escalation: "Elevates to Strategic Tier on deadlock",
    },
    {
      name:  "Tactical Tier",
      body:  "Realm Operators",
      icon:  "compass",
      decisionRights: ["Day-to-day domain execution", "Local protocol deployment", "Immediate operational decisions"],
      holders:  ["Realm Operators"],
      cadence:  "Continuous — 48h escalation threshold",
      quorum:   "Individual authority",
      escalation: "Escalates to Operational Tier within 48 hours",
    },
  ],

  realms: [
    { number: 1, name: "Foundation Realm",  timeline: "Months 1–2",  status: "complete", progress: 100, milestones: ["Constitutional governance structures deployed & Charter protocols enacted", "Seal of Authority formally activated across enterprise", "All seven throne positions formally assigned"] },
    { number: 2, name: "Covenant Realm",    timeline: "Months 2–3",  status: "active",   progress: 68,  milestones: ["Stakeholder covenant execution & partner alignment protocols activated", "Covenant Officer deploys SMP across all enterprise relationships", "Obligation tracking & breach alert systems operational"] },
    { number: 3, name: "Integration Realm", timeline: "Months 3–5",  status: "pending",  progress: 24,  milestones: ["Cross-system connectivity established via Enterprise Integration Bus", "EIB fully operational — all API governance frameworks live", "All seven throne-system pairs transmitting live data"] },
    { number: 4, name: "Expansion Realm",   timeline: "Months 5–8",  status: "pending",  progress: 0,   milestones: ["New domain conquest initiated & GIP projections activated", "Territory acquisition protocols engaged by Expansion Chancellor", "Growth blueprints deployed across target domains"] },
    { number: 5, name: "Sovereign Realm",   timeline: "Months 8–12", status: "pending",  progress: 0,   milestones: ["Full multi-realm operational sovereignty achieved across all domains", "All governance tiers active — continuous expansion cycle self-sustaining", "Sovereign Architecture declared fully operational"] },
  ],

  integrationStages: [
    { number: 1, name: "Artifact Canonisation",   timeline: "Weeks 1–3",  description: "Formally validate all seven Phase I artifacts. Establish baseline versions. Archive in KMS. Obtain Sovereign Council ratification.", status: "complete", side: "left"  },
    { number: 2, name: "System Onboarding",        timeline: "Weeks 4–7",  description: "Map each artifact to its primary enterprise system. Configure integration endpoints. Assign throne-system custodians. Document data flow diagrams.", status: "active",   side: "right" },
    { number: 3, name: "Governance Activation",    timeline: "Weeks 8–10", description: "Activate decision matrices and oversight protocols. Convene first Sovereign Council Review. Issue governance activation decree.", status: "pending",  side: "left"  },
    { number: 4, name: "Integration Testing",       timeline: "Weeks 11–14",description: "Cross-system validation, end-to-end data flow testing, covenant compliance audits, and Seal authentication stress tests.", status: "pending",  side: "right" },
    { number: 5, name: "Full Operational Deployment",timeline: "Weeks 15+", description: "All throne-system pairs go live. Continuous governance monitoring enabled. Realm activation sequence commences.", status: "pending",  side: "left"  },
  ],

  expansionVectors: [
    { number: 1, name: "Horizontal Domain Expansion", subtitle: "Vector I",  description: "Lateral acquisition of new operational territories. Each new domain follows the Realm Codex onboarding protocol before activation.", highlight: "Target: 3 new domains per expansion cycle." },
    { number: 2, name: "Vertical Integration Depth",  subtitle: "Vector II", description: "Deepening sovereign control within existing realms. Extends governance reach from strategic to ground-level operations.", highlight: "Eliminates authority gaps and integration blind spots." },
    { number: 3, name: "Alliance Protocol Network",   subtitle: "Vector III",description: "Multi-enterprise covenant partnerships governed by the Covenant Protocol. External partners become treaty-bound realm participants.", highlight: "Alliance governance matrices defined per partner." },
    { number: 4, name: "Digital Realm Sovereignty",   subtitle: "Vector IV", description: "Technology-driven realm creation. New digital territories governed from day one by Sovereign Architecture principles.", highlight: "AI, automation, and data realms included." },
  ],

  frameworks: [
    { number: 1, name: "Constitutional Operating Framework", source: "Sovereign Charter",                     description: "Defines the inviolable rules of enterprise engagement: decision rights, authority chains, veto powers, and constitutional amendments. The supreme law that no operational action may contravene.", icon: "constitution" },
    { number: 2, name: "Integration & Mapping Framework",    source: "Dominion Map + Throne Blueprint",       description: "Defines how every throne position, system node, and data flow connects across the enterprise topology. The connective architecture binding every realm to every system.", icon: "integration"  },
    { number: 3, name: "Governance & Accountability Framework", source: "Covenant Protocol + Seal of Authority", description: "Establishes the accountability ladder, audit protocols, covenant enforcement, and seal-based authorization gates. Every decision is traceable; every authority is bounded and verified.", icon: "governance"   },
    { number: 4, name: "Expansion & Activation Framework",   source: "Realm Codex + Expansion Mandate",      description: "Governs multi-realm activation cadence, new territory onboarding, and sovereign expansion protocols. The engine that transforms the Mandate from declaration into operational conquest.", icon: "expansion"    },
  ],

  milestones: [
    { milestoneNum: 1, quarter: "Q3", year: "2026", title: "Artifact-to-Framework Translation Complete", description: "All 7 artifacts ratified and mapped. Four operational frameworks documented and approved by Sovereign Council. KMS fully populated.", details: ["All 7 artifacts ratified and mapped", "Four operational frameworks documented and approved", "KMS fully populated"], status: "initiated"  },
    { milestoneNum: 2, quarter: "Q4", year: "2026", title: "Throne-to-System Mapping Operational",       description: "All 7 throne positions formally bound to enterprise systems. Integration Bus live. First Sovereign Council Review conducted.", details: ["All 7 throne positions formally bound to enterprise systems", "Integration Bus live", "First Sovereign Council Review conducted"], status: "scheduled"  },
    { milestoneNum: 3, quarter: "Q1", year: "2027", title: "Multi-Realm Activation Sequence Initiated",  description: "Realms I–III activated. Covenant Realm fully operational. Integration testing complete. Expansion Chancellor briefed and deployed.", details: ["Realms I–III activated", "Covenant Realm fully operational", "Expansion Chancellor briefed and deployed"], status: "pending"    },
    { milestoneNum: 4, quarter: "Q2", year: "2027", title: "Full Sovereign Operational Governance Achieved", description: "All 5 realms active. Expansion Blueprint executing. Continuous governance cycle self-sustaining. Sovereign Architecture declared complete.", details: ["All 5 realms active", "Expansion Blueprint executing", "Sovereign Architecture declared complete"], status: "complete"   },
  ],

  decisionTypes: [
    { name: "Strategic Decisions",  body: "Sovereign Council",  icon: "crown",   level: "unanimous", description: "Unanimous vote required. Affects enterprise-wide direction, artifact amendments, and realm boundary changes. No override except by Sovereign Architect invoking emergency Seal authority.", color: "#C9A84C" },
    { name: "Operational Decisions",body: "Domain Commanders", icon: "shield",  level: "quorum",    description: "2/3 quorum required. Covers system configurations, deployment mandates, and cross-domain integration approvals. Escalates to Strategic if deadlocked for 72+ hours.", color: "#7B9EC9" },
    { name: "Tactical Decisions",   body: "Realm Operators",   icon: "compass", level: "individual",description: "Individual authority. Day-to-day domain execution and local protocol deployment. Escalates to Operational Tier within 48 hours of unresolved issues.", color: "#7BC98C" },
    { name: "Emergency Protocol",   body: "Seal Guardian",     icon: "zap",     level: "override",  description: "Seal Guardian may invoke override authority during security breaches, covenant violations, or systemic failures. Immediate Sovereign notification required.", color: "#C97B7B" },
  ],

  soverignSealScore: 47,
  currentPhase:      "Foundation → Covenant Realm Transition",
  nextAction:        "Complete Covenant Protocol deployment — activate SMP across all enterprise relationships before advancing to Integration Realm",
};
