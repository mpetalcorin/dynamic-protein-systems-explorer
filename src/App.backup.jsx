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
    title: "Atom Structure-Function Relationships",
    icon: Dna,
    category: "Mechanistic biochemistry",
    summary:
      "Connects amino-acid sequence, three-dimensional structure, motion, interaction, and biological function.",
    details:
      "Atom function emerges from structure, dynamics, interfaces, and molecular context. For dynamic protein systems, a useful computational app should connect residues, domains, conformations, ligands, and biochemical outcomes into one interpretable framework.",
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
  { skill: "Atom dynamics", value: 92 },
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
            Dynamic Atom Systems Explorer
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
            <a href="#application" className="secondary-button">
              Application relevance
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
          <h2>Atom ensembles, not static snapshots</h2>
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
                <Radar dataKey="value" fillOpacity={0.35} />
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
                <Bar dataKey="score" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section id="application" className="application-section">
        <div className="section-header">
          <h2>How this app helps</h2>
          <p>
            This app is designed to communicate the scientific, computational, therapeutic, and
            connect molecular biology, computational modelling,
            deep learning, and mechanistic interpretation.
          </p>
        </div>

        <div className="application-grid">
          <div>
            <h3>Scientific message</h3>
            <p>
              Proteins are not rigid objects. Their function emerges from structure,
              motion, interaction, ligand-induced state changes, and energy landscapes.
              This app communicates that you understand dynamic molecular systems.
            </p>
          </div>

          <div>
            <h3>Computational message</h3>
            <p>
              The workflow shows how data science can support cryo-EM classification,
              conformational ensemble modelling, molecular dynamics interpretation,
              and deep learning-based scientific discovery.
            </p>
          </div>

          <div>
            <h3>Therapeutic message</h3>
            <p>
              E3 ligases, molecular glues, and PROTACs are presented as dynamic
              multi-protein systems where structural state, interface stability, and
              induced proximity determine biological outcome.
            </p>
          </div>

          <div>
            <h3>Collaboration message</h3>
            <p>
              The app highlights how experimental structural biology and computational
              mathematics can work together, matching the collaborative spirit of the
              Crick and Flatiron Institute partnership.
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
