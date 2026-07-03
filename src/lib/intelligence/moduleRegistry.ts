export interface ModuleConfig {
  id:                   string;
  seriesName:           string;
  engineName:           string;
  purpose:              string;
  dimensionLabels:      string[];
  driverContext:        string;
  correctionProtocols:  string[];
  backHref:             string;
  backLabel:            string;
  nextHref?:            string;
  nextLabel?:           string;
}

export const MODULE_REGISTRY: Record<string, ModuleConfig> = {

  /* ── S-SERIES ────────────────────────────────────────────── */
  S01: {
    id: "S01", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Identity Engine",
    purpose: "Reveals the enterprise's temporal selfhood — who it is in time, its rhythm personality, and whether its stated identity matches its actual strategic character.",
    dimensionLabels: ["Identity Clarity", "Strategic Alignment", "Reputation Index", "Market Recognition"],
    driverContext: "Identity Drivers govern this module most strongly — essence, spirit, field, domain determine whether strategy is authentic or performed.",
    correctionProtocols: ["Identity Stabilisation","Identity Realignment","Identity Amplification","Identity Coherence","Identity Elevation","Identity Sealing"],
    backHref: "/intelligence-hub", backLabel: "Intelligence Hub", nextHref: "/s02-strategic-direction", nextLabel: "Strategic Direction",
  },
  S02: {
    id: "S02", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Direction Engine",
    purpose: "Maps where the enterprise is genuinely heading — its stated vs actual direction, strategic north star clarity, and whether leadership is navigating toward destiny or drifting.",
    dimensionLabels: ["Direction Clarity", "Leadership Navigation", "Strategic Momentum", "Destiny Alignment"],
    driverContext: "Market Drivers and Identity Drivers interact here — the market pulls direction while identity anchors it.",
    correctionProtocols: ["Direction Stabilisation","Direction Realignment","Direction Amplification","Direction Coherence","Direction Elevation","Direction Sealing"],
    backHref: "/s01-strategic-identity", backLabel: "Strategic Identity", nextHref: "/s03-strategic-coherence", nextLabel: "Strategic Coherence",
  },
  S03: {
    id: "S03", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Coherence Engine",
    purpose: "Assesses whether the enterprise's strategy holds together internally — logical consistency, cross-functional alignment, and absence of strategic contradictions.",
    dimensionLabels: ["Internal Coherence", "Cross-Function Alignment", "Narrative Consistency", "Strategic Logic"],
    driverContext: "Cultural Drivers are critical here — coherence breaks when culture and strategy diverge.",
    correctionProtocols: ["Coherence Stabilisation","Coherence Realignment","Coherence Amplification","Coherence Integration","Coherence Elevation","Coherence Sealing"],
    backHref: "/s02-strategic-direction", backLabel: "Strategic Direction", nextHref: "/s04-strategic-convergence", nextLabel: "Strategic Convergence",
  },
  S04: {
    id: "S04", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Convergence Engine",
    purpose: "Measures how well strategic forces, teams, and priorities are converging toward unified outcomes rather than pulling in competing directions.",
    dimensionLabels: ["Strategy–Execution Convergence", "Leadership Convergence", "Resource–Priority Match", "OKR Coherence"],
    driverContext: "All five drivers converge in this module — convergence requires alignment of identity, market, culture, temporal, and destiny forces simultaneously.",
    correctionProtocols: ["Convergence Stabilisation","Convergence Realignment","Convergence Amplification","Convergence Synchronisation","Convergence Elevation","Convergence Sealing"],
    backHref: "/s03-strategic-coherence", backLabel: "Strategic Coherence", nextHref: "/s05-strategic-rhythm", nextLabel: "Strategic Rhythm",
  },
  S05: {
    id: "S05", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Rhythm Engine",
    purpose: "Assesses the enterprise's strategic cadence — how well strategic reviews, decision cycles, and execution rhythms align with organisational timing intelligence.",
    dimensionLabels: ["Review Cadence", "Decision Rhythm", "Execution Tempo", "Strategic Timing"],
    driverContext: "Temporal Drivers dominate here — the R-Series rhythm intelligence directly informs strategic timing quality.",
    correctionProtocols: ["Rhythm Stabilisation","Rhythm Realignment","Rhythm Amplification","Rhythm Synchronisation","Rhythm Elevation","Rhythm Sealing"],
    backHref: "/s04-strategic-convergence", backLabel: "Strategic Convergence", nextHref: "/s06-strategic-flow", nextLabel: "Strategic Flow",
  },
  S06: {
    id: "S06", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Flow Engine",
    purpose: "Measures whether strategy moves smoothly from vision through execution — identifying friction points, bottlenecks, and flow breaks in the strategic delivery system.",
    dimensionLabels: ["Vision-to-Execution Flow", "Strategic Friction", "Decision Flow Speed", "Implementation Continuity"],
    driverContext: "Structural Drivers and Temporal Drivers interact here — operational structures either enable or block strategic flow.",
    correctionProtocols: ["Flow Stabilisation","Flow Realignment","Flow Amplification","Flow Synchronisation","Flow Elevation","Flow Sealing"],
    backHref: "/s05-strategic-rhythm", backLabel: "Strategic Rhythm", nextHref: "/s07-strategic-field", nextLabel: "Strategic Rhythm Field",
  },
  S07: {
    id: "S07", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Rhythm Field Engine",
    purpose: "Maps the multilayer environment in which strategy lives, moves, and evolves — the invisible but powerful field that shapes decisions, timing, opportunities, constraints, and transformation velocity.",
    dimensionLabels: ["Structural Field", "Human Field", "Market Field", "Temporal Field", "Destiny Field"],
    driverContext: "All five drivers create the field simultaneously. The temporal field (from R-Series) and destiny field are the deepest and most influential layers.",
    correctionProtocols: ["Field Stabilisation","Field Synchronisation","Field Amplification","Field Alignment","Field Elevation","Field Sealing"],
    backHref: "/s06-strategic-flow", backLabel: "Strategic Flow", nextHref: "/s08-strategic-force", nextLabel: "Strategic Force",
  },
  S08: {
    id: "S08", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Force Engine",
    purpose: "Reveals the strategic forces acting on the enterprise — acceleration forces, resistance forces, distortion forces, sovereign forces, and destiny forces — and how they interact to shape strategic movement.",
    dimensionLabels: ["Acceleration Forces", "Resistance Forces", "Distortion Forces", "Sovereign Forces", "Destiny Forces"],
    driverContext: "Human Drivers create internal forces; Market Drivers create external forces; Temporal Drivers govern sovereign force direction; Destiny Drivers create the deepest gravitational pull.",
    correctionProtocols: ["Force Neutralisation","Force Redirection","Force Amplification","Force Harmonisation","Force Elevation","Force Sealing"],
    backHref: "/s07-strategic-field", backLabel: "Strategic Rhythm Field", nextHref: "/s09-strategic-gravity", nextLabel: "Strategic Gravity",
  },
  S09: {
    id: "S09", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Gravity Engine",
    purpose: "Identifies the gravitational centres pulling the enterprise toward certain strategic outcomes — revealing why some strategies succeed naturally while others resist constantly.",
    dimensionLabels: ["Identity Gravity", "Market Gravity", "Cultural Gravity", "Temporal Gravity", "Destiny Gravity"],
    driverContext: "Identity Drivers create the most stable gravitational pull. Destiny Drivers create the supreme gravitational centre toward authentic future.",
    correctionProtocols: ["Gravity Stabilisation","Gravity Realignment","Gravity Amplification","Gravity Neutralisation","Gravity Elevation","Gravity Sealing"],
    backHref: "/s08-strategic-force", backLabel: "Strategic Force", nextHref: "/s10-strategic-orbit", nextLabel: "Strategic Orbit",
  },
  S10: {
    id: "S10", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Orbit Engine",
    purpose: "Maps the repeating strategic cycles the enterprise falls into — identifying constructive orbits that must be protected and destructive orbits that must be broken or redesigned.",
    dimensionLabels: ["Identity Orbit", "Market Orbit", "Cultural Orbit", "Temporal Orbit", "Destiny Orbit"],
    driverContext: "Cultural Drivers create the most persistent orbits — culture determines which cycles repeat. Temporal Drivers govern orbital timing and frequency.",
    correctionProtocols: ["Orbit Break","Orbit Reset","Orbit Redesign","Orbit Elevation","Orbit Synchronisation","Orbit Sealing"],
    backHref: "/s09-strategic-gravity", backLabel: "Strategic Gravity", nextHref: "/s11-strategic-wave", nextLabel: "Strategic Wave",
  },
  S11: {
    id: "S11", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Wave Engine",
    purpose: "Maps propagating patterns of strategic energy moving through the enterprise — revealing how strategy spreads, how deeply it embeds, and how quickly it builds momentum or collapses.",
    dimensionLabels: ["Identity Wave", "Market Wave", "Cultural Wave", "Temporal Wave", "Destiny Wave"],
    driverContext: "All five drivers generate waves. Wave interference patterns between Identity and Market are the most common source of strategic momentum loss.",
    correctionProtocols: ["Wave Stabilisation","Wave Synchronisation","Wave Amplification","Wave Neutralisation","Wave Elevation","Wave Sealing"],
    backHref: "/s10-strategic-orbit", backLabel: "Strategic Orbit", nextHref: "/s12-strategic-horizon", nextLabel: "Strategic Horizon",
  },
  S12: {
    id: "S12", seriesName: "S-Series — Strategic Intelligence", engineName: "Strategic Horizon Engine",
    purpose: "Identifies the long-arc future the enterprise is actually moving toward — its trajectory, altitude, and whether the destiny horizon is visible, clear, and achievable from its current position.",
    dimensionLabels: ["Identity Horizon", "Market Horizon", "Cultural Horizon", "Temporal Horizon", "Destiny Horizon"],
    driverContext: "Destiny Drivers are supreme here — origin, source, crown, and totality encode the deepest horizon truth. The Temporal Horizon (from R-Series) determines arrival timing.",
    correctionProtocols: ["Horizon Stabilisation","Horizon Realignment","Horizon Elevation","Horizon Expansion","Horizon Acceleration","Horizon Sealing"],
    backHref: "/s11-strategic-wave", backLabel: "Strategic Wave", nextHref: "/intelligence-hub", nextLabel: "Intelligence Hub",
  },

  /* ── R-SERIES (representative subset — full registry continues) ── */
  R01: {
    id: "R01", seriesName: "R-Series — Rhythm Intelligence", engineName: "Rhythm Mapping Engine",
    purpose: "Provides the enterprise with its temporal map — the visualisation of how time moves through systems, workflows, decisions, people, markets, and transformation.",
    dimensionLabels: ["Strategic Rhythms", "Operational Rhythms", "Financial Rhythms", "Transformation Rhythms"],
    driverContext: "All five drivers create rhythm patterns. Temporal Drivers (from R-Series itself) and Identity Drivers create the most stable, coherent rhythm maps.",
    correctionProtocols: ["Rhythm Stabilisation","Rhythm Synchronisation","Rhythm Amplification","Rhythm Alignment","Rhythm Elevation","Rhythm Sealing"],
    backHref: "/rhythm-intelligence", backLabel: "Rhythm Intelligence", nextHref: "/r02-rhythm-velocity", nextLabel: "Rhythm Velocity",
  },
  R12: {
    id: "R12", seriesName: "R-Series — Rhythm Intelligence", engineName: "Rhythm Flow Engine",
    purpose: "Measures the degree to which rhythms across the enterprise move continuously, smoothly, and without interruption — creating frictionless temporal cadence across all layers.",
    dimensionLabels: ["Strategic Flow", "Operational Flow", "Financial Flow", "Compliance Flow"],
    driverContext: "Structural Drivers create the most common flow friction. Temporal Drivers and Identity Drivers create the conditions for sustained flow.",
    correctionProtocols: ["Flow Stabilisation","Flow Synchronisation","Flow Amplification","Flow Friction Reduction","Flow Elevation","Flow Sealing"],
    backHref: "/r11-rhythm-synchronization", backLabel: "Rhythm Synchronization", nextHref: "/r13-rhythm-resonance", nextLabel: "Rhythm Resonance",
  },
  R30: {
    id: "R30", seriesName: "R-Series — Rhythm Intelligence", engineName: "Rhythm Totality Engine",
    purpose: "The unifying intelligence that binds all 30 rhythm dimensions into one coherent, sovereign whole — where rhythm becomes total enterprise reality.",
    dimensionLabels: ["Arc 1 — Foundational Unity", "Arc 2 — Harmonic Unity", "Arc 3 — Synchronic Unity", "Arc 6 — Sovereign Unity"],
    driverContext: "All five drivers contribute equally to totality. The absence of totality in any driver creates a unity fracture that undermines the whole.",
    correctionProtocols: ["Totality Stabilisation","Totality Synchronisation","Totality Amplification","Unity Restoration","Totality Elevation","Totality Sealing"],
    backHref: "/r29-rhythm-crown", backLabel: "Rhythm Crown", nextHref: "/intelligence-hub", nextLabel: "Intelligence Hub",
  },

  /* ── Q-SERIES — Quantum Decision Intelligence ─────────────── */
  Q01: {
    id: "Q01", seriesName: "Q-Series — Quantum Decision Intelligence", engineName: "Quantum Decision Field Engine",
    purpose: "Maps the total quantum decision environment — the multistate field in which all enterprise decisions simultaneously exist as possibilities, probabilities, and outcomes before any single path is chosen.",
    dimensionLabels: ["Decision Field Clarity", "Possibility Space Width", "Field Coherence", "Quantum Readiness"],
    driverContext: "Identity Drivers anchor the decision field. Destiny Drivers reveal the highest-probability paths. All five drivers simultaneously inhabit and shape the quantum decision field.",
    correctionProtocols: ["Field Stabilisation","Field Synchronisation","Field Amplification","Field Alignment","Field Elevation","Field Sealing"],
    backHref: "/intelligence-hub", backLabel: "Intelligence Hub", nextHref: "/q02-quantum-state", nextLabel: "Quantum Decision State",
  },
  Q10: {
    id: "Q10", seriesName: "Q-Series — Quantum Decision Intelligence", engineName: "Quantum Decision Dimension Engine",
    purpose: "Explores the multi-dimensional layers of the enterprise decision space — revealing hidden decision dimensions that exist beyond the visible strategic, financial, and operational planes.",
    dimensionLabels: ["Visible Decision Dimensions", "Hidden Dimensions", "Temporal Dimensions", "Destiny Dimensions"],
    driverContext: "Destiny Drivers unlock the deepest decision dimensions. Identity Drivers determine which dimensions the enterprise is capable of perceiving and operating within.",
    correctionProtocols: ["Dimension Stabilisation","Dimension Synchronisation","Dimension Amplification","Dimension Alignment","Dimension Elevation","Dimension Sealing"],
    backHref: "/q09-quantum-selection", backLabel: "Quantum Decision Selection", nextHref: "/q11-quantum-reality", nextLabel: "Quantum Decision Reality",
  },
  Q50: {
    id: "Q50", seriesName: "Q-Series — Quantum Decision Intelligence", engineName: "Quantum Mastery Engine",
    purpose: "The capstone of the Intelligence Dimensions arc — the point at which the enterprise achieves mastery of quantum decision intelligence: operating consciously within the full decision field with complete awareness, clarity, and sovereign command.",
    dimensionLabels: ["Decision Mastery", "Field Mastery", "Temporal Mastery", "Sovereign Command"],
    driverContext: "All five drivers must be at mastery level for Q50 to register completion. The Destiny Driver is the final gate — mastery without destiny alignment is expertise, not sovereignty.",
    correctionProtocols: ["Mastery Stabilisation","Mastery Synchronisation","Mastery Amplification","Mastery Alignment","Mastery Elevation","Mastery Sealing"],
    backHref: "/q49-quantum-understanding", backLabel: "Quantum Understanding", nextHref: "/q51-quantum-power", nextLabel: "Quantum Power",
  },
  Q90: {
    id: "Q90", seriesName: "Q-Series — Quantum Decision Intelligence", engineName: "Quantum Sovereign Self Engine",
    purpose: "The culmination of the Sovereign Self arc — the enterprise achieves unified sovereign selfhood in quantum decision space. All prior 89 engines have built toward this: the enterprise knows its decision nature completely and can operate from its sovereign quantum self at will.",
    dimensionLabels: ["Sovereign Self Clarity", "Quantum Identity Completion", "Decision Sovereignty", "Destiny Alignment"],
    driverContext: "Destiny Drivers are supreme at Q90. The Sovereign Self cannot be reached through structural or market drivers alone — it requires the deepest Identity and Destiny alignment.",
    correctionProtocols: ["Sovereign Stabilisation","Sovereign Synchronisation","Sovereign Amplification","Sovereign Alignment","Sovereign Elevation","Sovereign Sealing"],
    backHref: "/q89-quantum-sovereign-identity", backLabel: "Quantum Sovereign Identity", nextHref: "/q91-sovereign-foundation", nextLabel: "Sovereign Foundation",
  },
  Q100: {
    id: "Q100", seriesName: "Q-Series — Quantum Decision Intelligence", engineName: "The Sovereign Seal",
    purpose: "The Sovereign Seal — the completion state of all 100 Quantum Decision Intelligence engines. The enterprise has navigated the full quantum decision field, achieved mastery across all dimensions, established its sovereign self, and now receives the Sovereign Seal: the mark of complete quantum decision sovereignty.",
    dimensionLabels: ["Seal Eligibility", "Sovereign Completeness", "Decision Sovereignty Index", "The Seal"],
    driverContext: "All five drivers must be at sovereign level. The Sovereign Seal cannot be claimed — it can only be earned by completing the full Q-Series journey from Q01 Field through Q99 Sovereignty.",
    correctionProtocols: ["Seal Preparation","Seal Alignment","Seal Amplification","Seal Verification","Seal Elevation","Seal Granting"],
    backHref: "/q99-sovereignty", backLabel: "Sovereignty Engine", nextHref: "/intelligence-hub", nextLabel: "Intelligence Hub",
  },

  /* ── X-SERIES ─────────────────────────────────────────────── */
  X01: {
    id: "X01", seriesName: "X-Series — Protection Intelligence", engineName: "Enterprise Protection Engine",
    purpose: "Comprehensive enterprise protection intelligence — treats protection as an immune system, not a set of policies. Maps risk, threat, and exposure across all enterprise dimensions with severity, velocity, and systemic coverage.",
    dimensionLabels: ["Structural Risk Exposure", "Human Risk Exposure", "Market Threat Level", "Systemic Vulnerability"],
    driverContext: "Market Drivers and Structural Drivers create the most protection signals. Identity Drivers determine risk appetite and organisational resilience culture.",
    correctionProtocols: ["Protection Stabilisation","Risk Mitigation","Threat Response","Exposure Reduction","Protection Elevation","Protection Sealing"],
    backHref: "/intelligence-hub", backLabel: "Intelligence Hub", nextHref: "/x02-security", nextLabel: "Security Intelligence",
  },
  X02: {
    id: "X02", seriesName: "X-Series — Protection Intelligence", engineName: "Security Intelligence Engine",
    purpose: "Enterprise security intelligence — maps cyber, physical, data, and operational security across all systems and people. Identifies security gaps, threat vectors, and protection readiness.",
    dimensionLabels: ["Cyber Security Posture", "Data Protection Status", "Physical Security", "Operational Security"],
    driverContext: "Structural Drivers and Market Drivers create the most security signals. Temporal Drivers govern when threats arrive and how quickly they must be resolved.",
    correctionProtocols: ["Security Stabilisation","Threat Neutralisation","Security Amplification","Coverage Alignment","Security Elevation","Security Sealing"],
    backHref: "/x01-protection", backLabel: "Enterprise Protection", nextHref: "/x03-governance", nextLabel: "Governance Intelligence",
  },
  X04: {
    id: "X04", seriesName: "X-Series — Protection Intelligence", engineName: "Compliance Intelligence Engine",
    purpose: "Enterprise compliance intelligence — maps regulatory requirements, compliance gaps, policy adherence, and audit readiness across all jurisdictions and industry frameworks.",
    dimensionLabels: ["Regulatory Compliance", "Policy Adherence", "Audit Readiness", "Reporting Integrity"],
    driverContext: "Structural Drivers define compliance frameworks. Market Drivers determine which regulations apply. Cultural Drivers determine whether compliance is embedded or performed.",
    correctionProtocols: ["Compliance Stabilisation","Gap Remediation","Compliance Amplification","Policy Alignment","Compliance Elevation","Compliance Sealing"],
    backHref: "/x03-governance", backLabel: "Governance Intelligence", nextHref: "/x05-ethics", nextLabel: "Ethics Intelligence",
  },
  X05: {
    id: "X05", seriesName: "X-Series — Protection Intelligence", engineName: "Ethics Intelligence Engine",
    purpose: "Enterprise ethics intelligence — assesses the ethical quality of decisions, culture, leadership conduct, and systemic behaviour. Treats ethics as a strategic asset and enterprise risk vector simultaneously.",
    dimensionLabels: ["Leadership Ethics", "Decision Ethics", "Cultural Ethics", "Systemic Ethics"],
    driverContext: "Identity Drivers determine ethical character. Cultural Drivers determine how ethics is embedded in daily behaviour. Destiny Drivers reveal whether ethics and ambition are aligned or in conflict.",
    correctionProtocols: ["Ethics Stabilisation","Conduct Realignment","Ethics Amplification","Ethical Alignment","Ethics Elevation","Ethics Sealing"],
    backHref: "/x04-compliance", backLabel: "Compliance Intelligence", nextHref: "/x06-resilience", nextLabel: "Resilience Intelligence",
  },

  /* ── A-SERIES ─────────────────────────────────────────────── */
  A32: {
    id: "A32", seriesName: "A-Series — TALENT Intelligence", engineName: "ETOS — Enterprise Talent Operating System",
    purpose: "The crown module of the A-Series — the Enterprise Talent Operating System integrates all 31 prior talent engines (A01–A31) into a single, unified, sovereign talent intelligence layer. ETOS is not just another engine; it is the operating system that governs how talent intelligence flows, decides, and self-corrects across the entire enterprise.",
    dimensionLabels: ["Talent OS Readiness", "Integration Completeness", "Sovereign Talent Capability", "ETOS Activation Status"],
    driverContext: "All five drivers must be active for ETOS to reach full operation. Identity Drivers encode the organisation's talent character; Destiny Drivers determine the talent trajectory the OS must deliver toward.",
    correctionProtocols: ["ETOS Stabilisation","Integration Completion","ETOS Amplification","Talent OS Alignment","ETOS Elevation","ETOS Sealing"],
    backHref: "/a31-talent-flow", backLabel: "Enterprise Talent Flow", nextHref: "/intelligence-hub", nextLabel: "Intelligence Hub",
  },

  /* ── Z-SERIES ─────────────────────────────────────────────── */
  Z01: {
    id: "Z01", seriesName: "Z-Series — Singularity Intelligence", engineName: "Singularity Mapping Engine",
    purpose: "Maps the enterprise's unified intelligence field — the convergence point of all intelligence series. Reveals where AI and human intelligence are integrating or fragmenting.",
    dimensionLabels: ["Strategic Intelligence Integration", "Operational Intelligence Integration", "Human Intelligence", "AI Intelligence"],
    driverContext: "Temporal Drivers and Destiny Drivers are most critical here — singularity requires temporal coherence and destiny alignment across all intelligence layers.",
    correctionProtocols: ["Singularity Stabilisation","Singularity Synchronisation","Singularity Amplification","Intelligence Alignment","Singularity Elevation","Singularity Sealing"],
    backHref: "/intelligence-hub", backLabel: "Intelligence Hub", nextHref: "/z02-singularity-velocity", nextLabel: "Singularity Velocity",
  },
  Z15: {
    id: "Z15", seriesName: "Z-Series — Singularity Intelligence", engineName: "Consciousness Flow Engine",
    purpose: "The capstone of the Z-Series — ensuring enterprise consciousness flows across all systems, people, and intelligence layers into a unified, self-aware, self-evolving organism.",
    dimensionLabels: ["Strategic Consciousness Flow", "Operational Consciousness Flow", "Human Consciousness Flow", "AI Consciousness Flow"],
    driverContext: "All five drivers must flow simultaneously for consciousness to achieve enterprise-wide coverage. Any driver blockage creates a consciousness gap.",
    correctionProtocols: ["Consciousness Stabilisation","Consciousness Synchronisation","Consciousness Amplification","Gap Restoration","Consciousness Elevation","Consciousness Sealing"],
    backHref: "/z14-consciousness-coherence", backLabel: "Consciousness Coherence", nextHref: "/intelligence-hub", nextLabel: "Intelligence Hub",
  },

  /* ── P-SERIES ─────────────────────────────────────────────── */
  P01: {
    id: "P01", seriesName: "P-Series — Enterprise Productivity", engineName: "Productivity Mapping Engine",
    purpose: "Maps productivity signals across all enterprise functions — identifying where value is being created, where capacity is wasted, and where improvement is most urgent.",
    dimensionLabels: ["Strategic Productivity", "Operational Productivity", "Digital Productivity", "Human Productivity"],
    driverContext: "Structural Drivers (processes, systems) and Human Drivers (leadership, culture) are the primary productivity shapers.",
    correctionProtocols: ["Productivity Stabilisation","Productivity Synchronisation","Productivity Amplification","Waste Elimination","Productivity Elevation","Productivity Sealing"],
    backHref: "/operations-intelligence", backLabel: "Operations Intelligence", nextHref: "/p02-productivity-velocity", nextLabel: "Productivity Velocity",
  },
  P28: {
    id: "P28", seriesName: "P-Series — Enterprise Productivity", engineName: "Convergence Engine",
    purpose: "The convergence intelligence layer — where all productivity forces unite into unified enterprise movement. Maps where productivity streams are converging and where they are diverging.",
    dimensionLabels: ["CORE–GROW Convergence", "GROW–TALENT Convergence", "Human–Digital Convergence", "Strategy–Execution Convergence"],
    driverContext: "All five drivers must converge simultaneously for enterprise productivity to reach its peak potential. Divergence in any driver creates fragmented output.",
    correctionProtocols: ["Convergence Stabilisation","Divergence Correction","Convergence Amplification","Pathway Formation","Convergence Elevation","Convergence Sealing"],
    backHref: "/p27-change-engine", backLabel: "Change Engine", nextHref: "/p29-synchronization", nextLabel: "Synchronization",
  },
  P30: {
    id: "P30", seriesName: "P-Series — Enterprise Productivity", engineName: "Flow Engine",
    purpose: "The capstone of the P-Series — where all enterprise productivity reaches frictionless, self-sustaining flow. The completion state where strategy, operations, and talent move as one continuous stream.",
    dimensionLabels: ["Strategic Flow", "Operational Flow", "Human Flow", "Digital Flow"],
    driverContext: "All five drivers must achieve flow simultaneously. The P-Series reaches P30 Flow when all prior modules (P01-P29) have been addressed. Flow is the natural result of resolved productivity intelligence.",
    correctionProtocols: ["Flow Stabilisation","Flow Synchronisation","Flow Amplification","Friction Elimination","Flow Elevation","Flow Sealing"],
    backHref: "/p29-synchronization", backLabel: "Synchronization", nextHref: "/operations-intelligence", nextLabel: "Operations Intelligence",
  },
};

/* Get config with fallback for any unregistered module */
export function getModuleConfig(moduleId: string): ModuleConfig | null {
  return MODULE_REGISTRY[moduleId] ?? null;
}

/* Generate a fallback config for any module not explicitly registered */
export function buildFallbackConfig(moduleId: string, seriesName: string, engineName: string): ModuleConfig {
  const series = moduleId.charAt(0);
  const seriesFullName = {
    S: "S-Series — Strategic Intelligence",
    R: "R-Series — Rhythm Intelligence",
    Q: "Q-Series — Quantum Decision Intelligence",
    X: "X-Series — Protection Intelligence",
    Z: "Z-Series — Singularity Intelligence",
    P: "P-Series — Enterprise Productivity",
    C: "LAMID CORE Intelligence",
    G: "LAMID GROW Intelligence",
    A: "LAMID TALENT Intelligence",
  }[series] ?? seriesName;

  return {
    id:                  moduleId,
    seriesName:          seriesFullName,
    engineName,
    purpose:             `${engineName} — an enterprise intelligence engine that provides deep diagnostic analysis and corrective intelligence for this domain.`,
    dimensionLabels:     ["Primary Dimension", "Secondary Dimension", "Tertiary Dimension", "Quaternary Dimension"],
    driverContext:       "All five drivers (Identity, Market, Cultural, Temporal, Destiny) shape the intelligence in this module.",
    correctionProtocols: ["Stabilisation","Synchronisation","Amplification","Alignment","Elevation","Sealing"],
    backHref:            "/intelligence-hub",
    backLabel:           "Intelligence Hub",
  };
}
