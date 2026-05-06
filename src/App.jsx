import { useMemo, useState } from "react";
import {
  Atom,
  Brain,
  Dna,
  FlaskConical,
  Layers,
  Microscope,
  Network,
  Rocket,
  Search,
  Sparkles,
  Zap,
  Activity,
  BarChart3,
  Download,
  LineChart as LineChartIcon,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { motion } from "framer-motion";
import "./App.css";

const modules = [
  {
    id: "time-resolved-cryo-em",
    title: "Time-Resolved Cryo-EM",
    icon: Microscope,
    category: "Structural biology",
    summary:
      "Captures molecular snapshots across time to infer how proteins move, assemble, and respond to ligands or substrates.",
    details:
      "Time-resolved cryo-EM allows structural biology to move beyond static images. Instead of seeing one dominant protein conformation, the workflow attempts to capture multiple structural states across a reaction or binding trajectory. In a protein degradation system, this could reveal how an E3 ubiquitin ligase engages a substrate, how a molecular glue stabilises an interface, or how a PROTAC brings two proteins together.",
    workflow: [
      "Prepare purified protein complex or ligand-bound system",
      "Trigger reaction or binding event",
      "Freeze samples across defined time windows",
      "Collect cryo-EM particle images",
      "Classify particles into conformational states",
      "Build structural models and infer molecular mechanism",
    ],
  },
  {
    id: "conformational-heterogeneity",
    title: "Conformational Heterogeneity",
    icon: Layers,
    category: "Dynamic protein states",
    summary:
      "Represents the fact that biomolecules often exist as ensembles of multiple shapes rather than one rigid structure.",
    details:
      "Conformational heterogeneity is central to modern cryo-EM and molecular biophysics. Proteins fluctuate between states, and those states often determine function. A computational workflow can classify particles, infer hidden states, model transitions, and connect those transitions to free energy landscapes.",
    workflow: [
      "Extract particle-level features",
      "Perform 2D and 3D classification",
      "Identify discrete or continuous structural states",
      "Map state transitions",
      "Relate structural states to biochemical activity",
    ],
  },
  {
    id: "e3-ligases",
    title: "E3 Ubiquitin Ligases",
    icon: Atom,
    category: "Targeted protein degradation",
    summary:
      "Molecular machines that recruit substrates and catalyse ubiquitin transfer, making them key targets for molecular glues and PROTACs.",
    details:
      "E3 ubiquitin ligases determine substrate specificity in the ubiquitin-proteasome system. Their activity depends on dynamic protein-protein interactions, transient complexes, substrate recruitment, and conformational switching. Structural and computational workflows can identify how ligands reshape these complexes.",
    workflow: [
      "Model E3-substrate interface",
      "Assess ligand-induced stabilisation",
      "Map substrate-recognition surfaces",
      "Identify conformational states that favour ubiquitination",
      "Prioritise residues for mutagenesis or biochemical testing",
    ],
  },
  {
    id: "molecular-glues-protacs",
    title: "Molecular Glues and PROTACs",
    icon: FlaskConical,
    category: "Chemical biology",
    summary:
      "Small molecules that induce or stabilise protein-protein interactions to redirect E3 ligases toward disease-relevant targets.",
    details:
      "Molecular glues and PROTACs exploit induced proximity. Instead of simply blocking a protein active site, they rewire molecular interactions. Cryo-EM, molecular dynamics, and deep learning can help explain why a molecule stabilises one ternary complex but not another.",
    workflow: [
      "Define E3, ligand, and target protein system",
      "Predict ternary complex formation",
      "Analyse interface complementarity",
      "Estimate conformational stabilisation",
      "Rank molecules by structural and mechanistic plausibility",
    ],
  },
  {
    id: "molecular-dynamics",
    title: "Molecular Dynamics",
    icon: Zap,
    category: "Simulation",
    summary:
      "Simulates atom-level movement to explore conformational transitions, interface stability, and free energy landscapes.",
    details:
      "Molecular dynamics complements cryo-EM by filling in motion between experimental states. It can test whether a ligand stabilises an E3-target interface, whether a loop transition exposes a binding surface, or whether a cryo-EM density map represents a stable or transient state.",
    workflow: [
      "Prepare atomic model",
      "Parameterise protein, ligand, solvent, and ions",
      "Run equilibration and production simulations",
      "Analyse RMSD, RMSF, contacts, distances, and clustering",
      "Link simulation states to cryo-EM classes",
    ],
  },
  {
    id: "deep-learning",
    title: "Deep Learning Workflows",
    icon: Brain,
    category: "AI for structural biology",
    summary:
      "Uses neural networks to classify structural states, denoise data, learn molecular representations, and predict protein-ligand behaviour.",
    details:
      "Deep learning can support particle classification, representation learning, map interpretation, protein structure prediction, ligand screening, and ensemble modelling. The strongest scientific use is not black-box prediction alone, but interpretable modelling linked to biochemical mechanism.",
    workflow: [
      "Curate structural, sequence, particle, or simulation data",
      "Engineer molecular and image-level features",
      "Train classification or embedding models",
      "Validate against experimental or mechanistic labels",
      "Interpret features and generate testable hypotheses",
    ],
  },
  {
    id: "flatiron-collaboration",
    title: "Flatiron-Style Computational Collaboration",
    icon: Network,
    category: "Collaborative computation",
    summary:
      "Combines mathematical modelling, structural biology, machine learning, and high-performance computing.",
    details:
      "The collaboration model links experimental cryo-EM expertise with computational mathematics and computational biology. The goal is to build analytical methods that can extract more information from structurally heterogeneous data and convert it into interpretable molecular models.",
    workflow: [
      "Define biological question with experimentalists",
      "Convert cryo-EM or MD data into computational objects",
      "Develop mathematical or machine learning models",
      "Benchmark against known structural states",
      "Return interpretable outputs to guide experiments",
    ],
  },
  {
    id: "structure-function",
    title: "Protein Structure-Function Relationships",
    icon: Dna,
    category: "Mechanistic biochemistry",
    summary:
      "Connects amino-acid sequence, three-dimensional structure, motion, interaction, and biological function.",
    details:
      "Protein function emerges from structure, dynamics, interfaces, and molecular context. For dynamic protein systems, a useful computational app should connect residues, domains, conformations, ligands, and biochemical outcomes into one interpretable framework.",
    workflow: [
      "Map sequence to domains and motifs",
      "Connect residues to structural regions",
      "Identify conformational switches",
      "Model ligand or partner effects",
      "Generate mechanistic hypotheses for experiments",
    ],
  },
];

const radarData = [
  { skill: "Cryo-EM", value: 78 },
  { skill: "Protein dynamics", value: 92 },
  { skill: "Molecular modelling", value: 86 },
  { skill: "Deep learning", value: 90 },
  { skill: "Biochemistry", value: 95 },
  { skill: "Collaboration", value: 88 },
];

const pipelineData = [
  { stage: "Sample", score: 72 },
  { stage: "Particles", score: 83 },
  { stage: "Classes", score: 89 },
  { stage: "Models", score: 86 },
  { stage: "MD", score: 91 },
  { stage: "AI", score: 93 },
];

const conformationalStates = [
  {
    state: "S1",
    label: "Open E3 conformation",
    population: 18,
    resolution: 3.8,
    freeEnergy: 2.1,
    rmsd: 3.4,
    interface: 42,
    aiScore: 68,
  },
  {
    state: "S2",
    label: "Substrate-searching state",
    population: 24,
    resolution: 3.5,
    freeEnergy: 1.4,
    rmsd: 2.8,
    interface: 57,
    aiScore: 76,
  },
  {
    state: "S3",
    label: "Ligand-stabilised ternary complex",
    population: 31,
    resolution: 3.1,
    freeEnergy: 0.4,
    rmsd: 1.9,
    interface: 84,
    aiScore: 94,
  },
  {
    state: "S4",
    label: "Ubiquitination-competent state",
    population: 19,
    resolution: 3.3,
    freeEnergy: 0.9,
    rmsd: 2.2,
    interface: 78,
    aiScore: 89,
  },
  {
    state: "S5",
    label: "Collapsed inactive state",
    population: 8,
    resolution: 4.2,
    freeEnergy: 3.5,
    rmsd: 4.6,
    interface: 29,
    aiScore: 41,
  },
];

const mdTrajectory = [
  { ns: 0, rmsd: 0.2, contacts: 32, energy: 3.2 },
  { ns: 20, rmsd: 1.1, contacts: 45, energy: 2.5 },
  { ns: 40, rmsd: 1.7, contacts: 58, energy: 1.9 },
  { ns: 60, rmsd: 2.0, contacts: 72, energy: 1.2 },
  { ns: 80, rmsd: 1.8, contacts: 81, energy: 0.8 },
  { ns: 100, rmsd: 1.9, contacts: 86, energy: 0.5 },
  { ns: 120, rmsd: 2.1, contacts: 84, energy: 0.6 },
  { ns: 140, rmsd: 2.0, contacts: 88, energy: 0.4 },
  { ns: 160, rmsd: 1.8, contacts: 90, energy: 0.3 },
  { ns: 180, rmsd: 1.9, contacts: 89, energy: 0.4 },
  { ns: 200, rmsd: 1.7, contacts: 91, energy: 0.2 },
];

const aiPrioritisation = [
  {
    system: "CRBN-molecular glue-target",
    ternaryComplex: 94,
    interfaceStability: 88,
    degradationPotential: 91,
    confidence: 92,
  },
  {
    system: "VHL-PROTAC-target",
    ternaryComplex: 89,
    interfaceStability: 84,
    degradationPotential: 87,
    confidence: 86,
  },
  {
    system: "DCAF15-glue-target",
    ternaryComplex: 82,
    interfaceStability: 76,
    degradationPotential: 80,
    confidence: 78,
  },
  {
    system: "MDM2-induced proximity",
    ternaryComplex: 71,
    interfaceStability: 69,
    degradationPotential: 64,
    confidence: 67,
  },
];

const freeEnergyLandscape = [
  { x: 1.0, y: 1.2, z: 2.1, state: "S1" },
  { x: 1.8, y: 2.0, z: 1.4, state: "S2" },
  { x: 2.5, y: 2.8, z: 0.4, state: "S3" },
  { x: 3.1, y: 2.2, z: 0.9, state: "S4" },
  { x: 3.8, y: 1.0, z: 3.5, state: "S5" },
];

function downloadCSV() {
  const headers = [
    "state",
    "label",
    "population_percent",
    "resolution_angstrom",
    "free_energy_relative",
    "rmsd_angstrom",
    "interface_score",
    "ai_score",
  ];

  const rows = conformationalStates.map((row) => [
    row.state,
    row.label,
    row.population,
    row.resolution,
    row.freeEnergy,
    row.rmsd,
    row.interface,
    row.aiScore,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${value}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dynamic_protein_systems_analysis.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(modules[0]);

  const filteredModules = useMemo(() => {
    const text = query.toLowerCase();
    return modules.filter(
      (module) =>
        module.title.toLowerCase().includes(text) ||
        module.category.toLowerCase().includes(text) ||
        module.summary.toLowerCase().includes(text)
    );
  }, [query]);

  const bestState = useMemo(() => {
    return [...conformationalStates].sort((a, b) => b.aiScore - a.aiScore)[0];
  }, []);

  const weightedMechanisticScore = useMemo(() => {
    const total = conformationalStates.reduce((sum, row) => {
      const populationWeight = row.population / 100;
      const stabilityWeight = 1 / (1 + row.freeEnergy);
      const interfaceWeight = row.interface / 100;
      return sum + populationWeight * stabilityWeight * interfaceWeight * 100;
    }, 0);

    return total.toFixed(1);
  }, []);

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="badge"
          >
            <Sparkles size={16} />
            Dynamic Protein Systems Explorer
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            AI-guided interpretation of protein motion, cryo-EM states, and molecular mechanism
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="hero-text"
          >
            A portfolio app connecting time-resolved cryo-EM, conformational heterogeneity,
            E3 ubiquitin ligases, molecular glues, PROTACs, molecular dynamics, deep learning,
            and protein structure-function relationships.
          </motion.p>

          <div className="hero-actions">
            <a href="#explorer" className="primary-button">
              Explore workflow
            </a>
            <a href="#advanced-analysis" className="secondary-button">
              View analysis
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="hero-card"
        >
          <div className="orbital">
            <Atom className="orbital-icon center-icon" size={52} />
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="orbit orbit-three"></div>
          </div>
          <h2>Protein ensembles, not static snapshots</h2>
          <p>
            The app frames structural biology as a state-space problem, where cryo-EM,
            molecular dynamics, and deep learning converge to explain function.
          </p>
        </motion.div>
      </section>

      <section className="metrics-grid">
        <div className="metric-card">
          <Microscope />
          <h3>Time-resolved structure</h3>
          <p>Reaction snapshots, cryo-EM classes, state trajectories.</p>
        </div>
        <div className="metric-card">
          <Layers />
          <h3>Heterogeneity</h3>
          <p>Discrete and continuous conformational states.</p>
        </div>
        <div className="metric-card">
          <Brain />
          <h3>Deep learning</h3>
          <p>Representation learning, classification, and interpretation.</p>
        </div>
        <div className="metric-card">
          <Rocket />
          <h3>Therapeutic relevance</h3>
          <p>E3 ligases, molecular glues, PROTACs, target engagement.</p>
        </div>
      </section>

      <section id="explorer" className="explorer-section">
        <div className="section-header">
          <h2>Interactive scientific workflow</h2>
          <p>
            Search or select a module to see how each scientific theme contributes to
            the analysis of dynamic biomolecular systems.
          </p>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cryo-EM, PROTACs, molecular dynamics, deep learning..."
          />
        </div>

        <div className="explorer-layout">
          <div className="module-list">
            {filteredModules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setSelected(module)}
                  className={`module-button ${
                    selected.id === module.id ? "active" : ""
                  }`}
                >
                  <Icon size={20} />
                  <span>
                    <strong>{module.title}</strong>
                    <small>{module.category}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <motion.article
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="detail-card"
          >
            <div className="detail-title">
              <selected.icon size={28} />
              <div>
                <h3>{selected.title}</h3>
                <p>{selected.category}</p>
              </div>
            </div>

            <p className="summary">{selected.summary}</p>
            <p>{selected.details}</p>

            <h4>Workflow logic</h4>
            <ol>
              {selected.workflow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </motion.article>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-card">
          <h2>Role-aligned capability map</h2>
          <p>
            This illustrative radar map shows the capability areas expected in a
            computational structural biology data scientist role.
          </p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h2>Integrated analysis pipeline</h2>
          <p>
            A conceptual pipeline linking experimental cryo-EM data, molecular
            modelling, MD simulation, and AI-based interpretation.
          </p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={pipelineData}>
                <XAxis dataKey="stage" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section id="advanced-analysis" className="advanced-section">
        <div className="section-header">
          <h2>Advanced analysis and visualisation of results</h2>
          <p>
            This section simulates how a computational structural biology workflow could
            summarise cryo-EM classes, conformational heterogeneity, molecular dynamics
            stability, and AI-based mechanistic prioritisation.
          </p>
        </div>

        <div className="analysis-summary-grid">
          <div className="analysis-stat">
            <Activity />
            <span>Top structural state</span>
            <strong>{bestState.state}: {bestState.label}</strong>
          </div>

          <div className="analysis-stat">
            <Target />
            <span>Best AI mechanistic score</span>
            <strong>{bestState.aiScore}/100</strong>
          </div>

          <div className="analysis-stat">
            <LineChartIcon />
            <span>Weighted mechanistic index</span>
            <strong>{weightedMechanisticScore}</strong>
          </div>

          <button className="download-button" onClick={downloadCSV}>
            <Download size={18} />
            Download analysis CSV
          </button>
        </div>

        <div className="advanced-grid">
          <div className="chart-card">
            <h3>Cryo-EM conformational state populations</h3>
            <p>
              Simulated particle-class distribution across five structural states.
              Higher population may indicate a favoured or stabilised conformational basin.
            </p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={conformationalStates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="population" name="Population (%)" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Relative free-energy-like landscape</h3>
            <p>
              Lower values represent more favourable conformational basins. State S3
              is modelled as a ligand-stabilised ternary complex.
            </p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name="Conformational coordinate 1" />
                  <YAxis dataKey="y" name="Conformational coordinate 2" />
                  <ZAxis dataKey="z" range={[80, 320]} name="Relative free energy" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={freeEnergyLandscape} name="States">
                    {freeEnergyLandscape.map((entry) => (
                      <Cell key={entry.state} fill={["#38bdf8", "#a78bfa", "#22c55e", "#f97316", "#f43f5e"][freeEnergyLandscape.findIndex((x) => x.state === entry.state) % 5]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Molecular dynamics stability trajectory</h3>
            <p>
              Simulated RMSD and contact formation across a 200 ns trajectory,
              representing stabilisation of a ternary complex interface.
            </p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={mdTrajectory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ns" label={{ value: "Time (ns)", position: "insideBottom", offset: -2 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rmsd" name="RMSD (Å)" stroke="#f97316" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="energy" name="Relative energy" stroke="#22c55e" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Interface contact formation</h3>
            <p>
              Simulated number of stabilising protein-protein interface contacts
              during molecular dynamics simulation.
            </p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={mdTrajectory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ns" label={{ value: "Time (ns)", position: "insideBottom", offset: -2 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="contacts" name="Interface contacts" stroke="#a78bfa" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>AI prioritisation of degradation systems</h3>
            <p>
              Simulated ranking of E3-ligase systems based on ternary-complex formation,
              interface stability, degradation potential, and model confidence.
            </p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={aiPrioritisation} layout="vertical" margin={{ left: 90 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="system" type="category" width={140} />
                  <Tooltip />
                  <Bar dataKey="ternaryComplex" name="Ternary complex" fill="#38bdf8" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="interfaceStability" name="Interface stability" fill="#a78bfa" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="degradationPotential" name="Degradation potential" fill="#22c55e" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>State contribution to mechanistic interpretation</h3>
            <p>
              Combined view of conformational population, interface quality, and AI
              score. State S3 contributes the strongest mechanistic signal.
            </p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie
                    data={conformationalStates}
                    dataKey="aiScore"
                    nameKey="state"
                    outerRadius={110}
                    label
                  >
                    {conformationalStates.map((entry) => (
                      <Cell key={entry.state} fill={["#38bdf8", "#a78bfa", "#22c55e", "#f97316", "#f43f5e"][conformationalStates.findIndex((x) => x.state === entry.state) % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <div>
              <h3>Conformational state analysis table</h3>
              <p>
                Simulated output showing how cryo-EM, MD, interface scoring, and AI-based
                interpretation could be integrated into one decision table.
              </p>
            </div>
            <BarChart3 />
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Interpretation</th>
                  <th>Population (%)</th>
                  <th>Resolution (Å)</th>
                  <th>Relative free energy</th>
                  <th>RMSD (Å)</th>
                  <th>Interface score</th>
                  <th>AI score</th>
                </tr>
              </thead>
              <tbody>
                {conformationalStates.map((row) => (
                  <tr key={row.state}>
                    <td>{row.state}</td>
                    <td>{row.label}</td>
                    <td>{row.population}</td>
                    <td>{row.resolution}</td>
                    <td>{row.freeEnergy}</td>
                    <td>{row.rmsd}</td>
                    <td>{row.interface}</td>
                    <td>
                      <strong>{row.aiScore}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="interpretation-card">
          <h3>Scientific interpretation</h3>
          <p>
            In this simulated analysis, state S3 represents the strongest candidate
            mechanistic state because it combines the highest cryo-EM population among
            favourable conformers, the lowest relative free-energy-like value, high
            interface stability, low RMSD, and the strongest AI-derived mechanistic score.
            This is the kind of integrated reasoning that can connect cryo-EM particle
            classification, conformational ensemble analysis, molecular dynamics, and
            deep learning into a testable biochemical hypothesis.
          </p>
          <p>
            For an E3 ligase, molecular glue, or PROTAC system, such a result would suggest
            that ligand-induced proximity is not simply a binding event. It is a structural
            state-selection problem, where a small molecule enriches a productive ensemble
            that places the E3 ligase, substrate, and ubiquitination machinery into a
            functionally competent arrangement.
          </p>
        </div>
      </section>

      <section id="application" className="application-section">
        <div className="section-header">
          <h2>App relevance</h2>
          <p>
            This app is designed as a research-facing interface for exploring how dynamic
            protein systems can be analysed through structural biology, molecular simulation,
            and AI-assisted interpretation. It turns complex cryo-EM, molecular dynamics,
            and protein-interaction concepts into an organised workflow that can support
            hypothesis generation, result interpretation, and scientific communication.
          </p>
        </div>

        <div className="application-grid">
          <div>
            <h3>For cryo-EM analysis</h3>
            <p>
              The app provides a structured way to summarise conformational state
              populations, map quality, particle-class interpretation, and functional
              state assignment. This makes it useful for explaining how heterogeneous
              cryo-EM data can be converted into biological insight.
            </p>
          </div>

          <div>
            <h3>For conformational heterogeneity</h3>
            <p>
              The app treats proteins as ensembles of related structural states. This is
              relevant for analysing proteins that shift between open, closed, ligand-bound,
              substrate-bound, inactive, and catalytically competent conformations.
            </p>
          </div>

          <div>
            <h3>For molecular dynamics</h3>
            <p>
              The app links simulated molecular dynamics outputs, including RMSD,
              interface contacts, and relative stability, to cryo-EM-derived states. This
              helps evaluate whether a structural state is stable, transient, or
              ligand-stabilised.
            </p>
          </div>

          <div>
            <h3>For deep learning workflows</h3>
            <p>
              The app demonstrates how AI models can be used to rank structural states,
              prioritise mechanistic hypotheses, and organise complex biological data.
              The emphasis is on explainable, experimentally testable interpretation.
            </p>
          </div>

          <div>
            <h3>For E3 ligases, molecular glues, and PROTACs</h3>
            <p>
              The app is relevant to targeted protein degradation because it models
              induced proximity as a dynamic structural problem. It helps explain how
              E3 ligase recruitment, ternary-complex stability, and conformational state
              selection may influence degradation competence.
            </p>
          </div>

          <div>
            <h3>For research communication</h3>
            <p>
              The app converts advanced computational structural biology concepts into
              an accessible visual format. This makes it useful for project discussions,
              lab presentations, collaborative planning, portfolio demonstration, and
              early-stage method development.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <p>
          Built as a scientific portfolio app for dynamic structural biology,
          computational biochemistry, and AI-guided protein mechanism.
        </p>
      </footer>
    </main>
  );
}

export default App;
