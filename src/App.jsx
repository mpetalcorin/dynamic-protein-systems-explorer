import { useMemo, useState } from "react";
import {
  Activity,
  Atom,
  BarChart3,
  Brain,
  CheckCircle2,
  Dna,
  Download,
  FlaskConical,
  Layers,
  LineChart as LineChartIcon,
  Microscope,
  Network,
  Rocket,
  Search,
  Sparkles,
  Target,
  Upload,
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
      "Time-resolved cryo-EM allows structural biology to move beyond static images. Instead of seeing one dominant protein conformation, the workflow attempts to capture multiple structural states across a reaction or binding trajectory.",
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
      "Conformational heterogeneity is central to modern cryo-EM and molecular biophysics. Proteins fluctuate between states, and those states often determine function.",
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
      "E3 ubiquitin ligases determine substrate specificity in the ubiquitin-proteasome system. Their activity depends on dynamic protein-protein interactions, transient complexes, substrate recruitment, and conformational switching.",
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
      "Molecular glues and PROTACs exploit induced proximity. Instead of simply blocking a protein active site, they rewire molecular interactions.",
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
      "Molecular dynamics complements cryo-EM by filling in motion between experimental states. It can test whether a ligand stabilises an E3-target interface or whether a cryo-EM density map represents a stable or transient state.",
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
      "Deep learning can support particle classification, representation learning, map interpretation, protein structure prediction, ligand screening, and ensemble modelling.",
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
      "The collaboration model links experimental cryo-EM expertise with computational mathematics and computational biology.",
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
      "Protein function emerges from structure, dynamics, interfaces, and molecular context.",
    workflow: [
      "Map sequence to domains and motifs",
      "Connect residues to structural regions",
      "Identify conformational switches",
      "Model ligand or partner effects",
      "Generate mechanistic hypotheses for experiments",
    ],
  },
];

const datasetLibrary = {
  "CRBN molecular glue system": [
    { state: "S1", label: "Open E3 conformation", population: 18, resolution: 3.8, freeEnergy: 2.1, rmsd: 3.4, interface: 42, aiScore: 68 },
    { state: "S2", label: "Substrate-searching state", population: 24, resolution: 3.5, freeEnergy: 1.4, rmsd: 2.8, interface: 57, aiScore: 76 },
    { state: "S3", label: "Ligand-stabilised ternary complex", population: 31, resolution: 3.1, freeEnergy: 0.4, rmsd: 1.9, interface: 84, aiScore: 94 },
    { state: "S4", label: "Ubiquitination-competent state", population: 19, resolution: 3.3, freeEnergy: 0.9, rmsd: 2.2, interface: 78, aiScore: 89 },
    { state: "S5", label: "Collapsed inactive state", population: 8, resolution: 4.2, freeEnergy: 3.5, rmsd: 4.6, interface: 29, aiScore: 41 },
  ],
  "VHL PROTAC system": [
    { state: "S1", label: "Separated binary complex", population: 20, resolution: 4.0, freeEnergy: 2.7, rmsd: 3.8, interface: 35, aiScore: 55 },
    { state: "S2", label: "Weak ternary encounter", population: 25, resolution: 3.7, freeEnergy: 1.8, rmsd: 3.0, interface: 61, aiScore: 74 },
    { state: "S3", label: "Stable VHL-target ternary complex", population: 36, resolution: 3.0, freeEnergy: 0.3, rmsd: 1.7, interface: 88, aiScore: 96 },
    { state: "S4", label: "Productive degradation pose", population: 14, resolution: 3.4, freeEnergy: 0.8, rmsd: 2.1, interface: 82, aiScore: 90 },
    { state: "S5", label: "Off-pathway complex", population: 5, resolution: 4.4, freeEnergy: 3.8, rmsd: 5.0, interface: 22, aiScore: 35 },
  ],
  "ATP synthase conformational states": [
    { state: "S1", label: "Open catalytic beta state", population: 22, resolution: 3.6, freeEnergy: 1.6, rmsd: 2.5, interface: 70, aiScore: 82 },
    { state: "S2", label: "Loose catalytic beta state", population: 28, resolution: 3.3, freeEnergy: 0.9, rmsd: 2.1, interface: 76, aiScore: 88 },
    { state: "S3", label: "Tight catalytic beta state", population: 30, resolution: 3.0, freeEnergy: 0.5, rmsd: 1.8, interface: 84, aiScore: 93 },
    { state: "S4", label: "Rotor-coupled transition", population: 15, resolution: 3.5, freeEnergy: 1.1, rmsd: 2.7, interface: 68, aiScore: 77 },
    { state: "S5", label: "Uncoupled low-activity state", population: 5, resolution: 4.1, freeEnergy: 3.2, rmsd: 4.4, interface: 31, aiScore: 40 },
  ],
  "DNA repair protein complex": [
    { state: "S1", label: "DNA-searching state", population: 21, resolution: 3.9, freeEnergy: 2.0, rmsd: 3.2, interface: 48, aiScore: 66 },
    { state: "S2", label: "DNA-engaged intermediate", population: 27, resolution: 3.4, freeEnergy: 1.0, rmsd: 2.4, interface: 75, aiScore: 85 },
    { state: "S3", label: "Repair-competent assembly", population: 29, resolution: 3.1, freeEnergy: 0.5, rmsd: 1.9, interface: 87, aiScore: 95 },
    { state: "S4", label: "Checkpoint-associated state", population: 16, resolution: 3.6, freeEnergy: 1.3, rmsd: 2.8, interface: 71, aiScore: 79 },
    { state: "S5", label: "Disassembled inactive state", population: 7, resolution: 4.5, freeEnergy: 3.6, rmsd: 5.1, interface: 24, aiScore: 38 },
  ],
  "Kinase inhibitor-bound conformations": [
    { state: "S1", label: "Active DFG-in state", population: 17, resolution: 3.2, freeEnergy: 1.8, rmsd: 2.6, interface: 62, aiScore: 72 },
    { state: "S2", label: "Inhibitor encounter state", population: 23, resolution: 3.4, freeEnergy: 1.2, rmsd: 2.3, interface: 70, aiScore: 81 },
    { state: "S3", label: "Stabilised inhibited conformation", population: 35, resolution: 2.9, freeEnergy: 0.3, rmsd: 1.5, interface: 89, aiScore: 97 },
    { state: "S4", label: "Allosteric inactive state", population: 18, resolution: 3.3, freeEnergy: 0.8, rmsd: 2.0, interface: 80, aiScore: 88 },
    { state: "S5", label: "Flexible unresolved state", population: 7, resolution: 4.3, freeEnergy: 3.1, rmsd: 4.7, interface: 28, aiScore: 43 },
  ],
};

const comparisonLibrary = [
  { system: "CRBN molecular glue system", ternaryComplex: 94, interfaceStability: 88, degradationPotential: 91, confidence: 92 },
  { system: "VHL PROTAC system", ternaryComplex: 89, interfaceStability: 84, degradationPotential: 87, confidence: 86 },
  { system: "DCAF15 glue-target system", ternaryComplex: 82, interfaceStability: 76, degradationPotential: 80, confidence: 78 },
  { system: "MDM2 induced-proximity system", ternaryComplex: 71, interfaceStability: 69, degradationPotential: 64, confidence: 67 },
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

const radarData = [
  { skill: "Cryo-EM", value: 82 },
  { skill: "Protein dynamics", value: 94 },
  { skill: "Molecular modelling", value: 90 },
  { skill: "Deep learning", value: 91 },
  { skill: "Biochemistry", value: 95 },
  { skill: "Collaboration", value: 89 },
];

const pipelineData = [
  { stage: "Sample", score: 72 },
  { stage: "Particles", score: 83 },
  { stage: "Classes", score: 89 },
  { stage: "Models", score: 86 },
  { stage: "MD", score: 91 },
  { stage: "AI", score: 93 },
];

const references = [
  {
    topic: "Cryo-EM resolution revolution",
    citation: "Kühlbrandt, W. (2014). The resolution revolution. Science, 343, 1443–1444.",
    doi: "https://doi.org/10.1126/science.1251652",
  },
  {
    topic: "Single-particle cryo-EM",
    citation: "Cheng, Y. (2015). Single-particle cryo-EM at crystallographic resolution. Cell, 161, 450–457.",
    doi: "https://doi.org/10.1016/j.cell.2015.03.049",
  },
  {
    topic: "Molecular dynamics",
    citation: "Karplus, M., & McCammon, J. A. (2002). Molecular dynamics simulations of biomolecules. Nature Structural Biology, 9, 646–652.",
    doi: "https://doi.org/10.1038/nsb0902-646",
  },
  {
    topic: "PROTACs",
    citation: "Sakamoto, K. M., et al. (2001). Protacs: chimeric molecules that target proteins to the Skp1-Cullin-F box complex for ubiquitination and degradation. Proceedings of the National Academy of Sciences, 98, 8554–8559.",
    doi: "https://doi.org/10.1073/pnas.141230798",
  },
  {
    topic: "Molecular glues",
    citation: "Ito, T., et al. (2010). Identification of a primary target of thalidomide teratogenicity. Science, 327, 1345–1350.",
    doi: "https://doi.org/10.1126/science.1177319",
  },
  {
    topic: "Protein structure prediction",
    citation: "Jumper, J., et al. (2021). Highly accurate protein structure prediction with AlphaFold. Nature, 596, 583–589.",
    doi: "https://doi.org/10.1038/s41586-021-03819-2",
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mapQualityScore(resolution) {
  return clamp(100 - (resolution - 2.5) * 22, 0, 100);
}

function stabilityScore(freeEnergy, rmsd) {
  const energyScore = clamp(100 - freeEnergy * 22, 0, 100);
  const rmsdScore = clamp(100 - rmsd * 15, 0, 100);
  return (energyScore + rmsdScore) / 2;
}

function mechanisticScore(row) {
  return (
    0.25 * row.population +
    0.2 * mapQualityScore(row.resolution) +
    0.2 * row.interface +
    0.2 * stabilityScore(row.freeEnergy, row.rmsd) +
    0.15 * row.aiScore
  );
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return null;

  const headers = lines[0].split(",").map((x) => x.trim().replace(/^"|"$/g, ""));
  const required = ["state", "label", "population", "resolution", "freeEnergy", "rmsd", "interface", "aiScore"];
  const hasAll = required.every((h) => headers.includes(h));

  if (!hasAll) return null;

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((x) => x.trim().replace(/^"|"$/g, ""));
    const obj = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    return {
      state: obj.state,
      label: obj.label,
      population: Number(obj.population),
      resolution: Number(obj.resolution),
      freeEnergy: Number(obj.freeEnergy),
      rmsd: Number(obj.rmsd),
      interface: Number(obj.interface),
      aiScore: Number(obj.aiScore),
    };
  });
}

function analyseSequence(sequenceInput) {
  const sequence = sequenceInput.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "");
  const length = sequence.length;
  if (!length) {
    return {
      length: 0,
      molecularWeight: 0,
      chargedPercent: 0,
      hydrophobicPercent: 0,
      flexiblePercent: 0,
      lowComplexityNote: "Paste a protein sequence to begin analysis.",
    };
  }

  const avgResidueMass = 110;
  const charged = (sequence.match(/[DEKRH]/g) || []).length;
  const hydrophobic = (sequence.match(/[AILMFWVY]/g) || []).length;
  const flexible = (sequence.match(/[GPSTNQ]/g) || []).length;

  const repeats = sequence.match(/(.)\1{4,}/g);
  const lowComplexityNote = repeats
    ? "Possible low-complexity or repetitive segment detected."
    : "No obvious long single-residue repeat detected.";

  return {
    length,
    molecularWeight: Math.round(length * avgResidueMass),
    chargedPercent: ((charged / length) * 100).toFixed(1),
    hydrophobicPercent: ((hydrophobic / length) * 100).toFixed(1),
    flexiblePercent: ((flexible / length) * 100).toFixed(1),
    lowComplexityNote,
  };
}

function makeHypothesis(bestState) {
  return `${bestState.state}, ${bestState.label}, is prioritised because it combines a particle population of ${bestState.population}%, a resolution of ${bestState.resolution} Å, a relative free-energy-like value of ${bestState.freeEnergy}, an interface score of ${bestState.interface}/100, and an AI score of ${bestState.aiScore}/100. This pattern supports the hypothesis that this state represents a structurally enriched, functionally relevant conformation that should be tested by mutagenesis, binding assays, repeat cryo-EM classification, or molecular dynamics extension.`;
}

function recommendedExperiments(bestState) {
  const suggestions = [
    "Site-directed mutagenesis of high-contribution interface residues.",
    "HDX-MS or limited proteolysis to test conformational protection.",
    "Crosslinking mass spectrometry to validate proximity between subunits.",
    "Repeat time-resolved cryo-EM using earlier and later reaction time points.",
    "Ubiquitination or degradation assay if the system contains an E3 ligase, molecular glue, or PROTAC.",
    "SPR or BLI binding assay to quantify binary and ternary complex formation.",
    "Thermal shift assay to test ligand-induced stabilisation.",
    "Longer molecular dynamics simulation to assess state persistence and interface lifetime.",
  ];

  if (bestState.aiScore > 90) {
    suggestions.unshift("Prioritise this state for immediate experimental validation because the integrated mechanistic score is high.");
  }

  return suggestions;
}

function makeFreeEnergyLandscape(states) {
  return states.map((row, index) => ({
    x: 1 + index * 0.8,
    y: 1.2 + Math.sin(index + 1) * 1.1,
    z: row.freeEnergy,
    state: row.state,
  }));
}

function downloadCSV(states) {
  const headers = ["state", "label", "population", "resolution", "freeEnergy", "rmsd", "interface", "aiScore", "mechanisticScore"];
  const rows = states.map((row) => [
    row.state,
    row.label,
    row.population,
    row.resolution,
    row.freeEnergy,
    row.rmsd,
    row.interface,
    row.aiScore,
    mechanisticScore(row).toFixed(1),
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

function downloadReport({ datasetName, states, bestState, hypothesis, sequenceStats, comparisonA, comparisonB }) {
  const report = `
Dynamic Protein Systems Explorer, Research Report

Dataset:
${datasetName}

Top-ranked state:
${bestState.state}, ${bestState.label}

Generated hypothesis:
${hypothesis}

Scoring formula:
Mechanistic score = 0.25 × population score + 0.20 × map quality score + 0.20 × interface score + 0.20 × molecular-dynamics stability score + 0.15 × AI confidence score.

Conformational state table:
${states
      .map(
        (row) =>
          `${row.state}: ${row.label}, population=${row.population}%, resolution=${row.resolution} Å, freeEnergy=${row.freeEnergy}, RMSD=${row.rmsd} Å, interface=${row.interface}, AI=${row.aiScore}, mechanisticScore=${mechanisticScore(row).toFixed(1)}`
      )
      .join("\n")}

Protein sequence analysis:
Length=${sequenceStats.length}
Estimated molecular weight=${sequenceStats.molecularWeight} Da
Charged residues=${sequenceStats.chargedPercent}%
Hydrophobic residues=${sequenceStats.hydrophobicPercent}%
Flexible/disorder-associated residues=${sequenceStats.flexiblePercent}%
Low-complexity note=${sequenceStats.lowComplexityNote}

Comparison mode:
System A=${comparisonA.system}
System B=${comparisonB.system}

Recommended next experiments:
${recommendedExperiments(bestState).map((x, i) => `${i + 1}. ${x}`).join("\n")}

Scientific note:
This report is a research-facing simulation interface. It is designed to organise structural, simulation, and AI-derived signals into interpretable mechanistic hypotheses.
`;

  const blob = new Blob([report], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dynamic_protein_systems_report.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(modules[0]);
  const [datasetName, setDatasetName] = useState("CRBN molecular glue system");
  const [states, setStates] = useState(datasetLibrary["CRBN molecular glue system"]);
  const [csvMessage, setCsvMessage] = useState("No uploaded CSV. Using built-in sample data.");
  const [sequence, setSequence] = useState("");
  const [comparisonAName, setComparisonAName] = useState("CRBN molecular glue system");
  const [comparisonBName, setComparisonBName] = useState("VHL PROTAC system");

  const filteredModules = useMemo(() => {
    const text = query.toLowerCase();
    return modules.filter(
      (module) =>
        module.title.toLowerCase().includes(text) ||
        module.category.toLowerCase().includes(text) ||
        module.summary.toLowerCase().includes(text)
    );
  }, [query]);

  const scoredStates = useMemo(() => {
    return states.map((row) => ({
      ...row,
      mechanisticScore: Number(mechanisticScore(row).toFixed(1)),
    }));
  }, [states]);

  const bestState = useMemo(() => {
    return [...states].sort((a, b) => mechanisticScore(b) - mechanisticScore(a))[0];
  }, [states]);

  const weightedMechanisticScore = useMemo(() => {
    const total = states.reduce((sum, row) => {
      const populationWeight = row.population / 100;
      const stabilityWeight = 1 / (1 + row.freeEnergy);
      const interfaceWeight = row.interface / 100;
      return sum + populationWeight * stabilityWeight * interfaceWeight * 100;
    }, 0);

    return total.toFixed(1);
  }, [states]);

  const freeEnergyLandscape = useMemo(() => makeFreeEnergyLandscape(states), [states]);
  const hypothesis = useMemo(() => makeHypothesis(bestState), [bestState]);
  const sequenceStats = useMemo(() => analyseSequence(sequence), [sequence]);

  const comparisonA = comparisonLibrary.find((x) => x.system === comparisonAName) || comparisonLibrary[0];
  const comparisonB = comparisonLibrary.find((x) => x.system === comparisonBName) || comparisonLibrary[1];

  const comparisonData = [
    { metric: "Ternary complex", A: comparisonA.ternaryComplex, B: comparisonB.ternaryComplex },
    { metric: "Interface stability", A: comparisonA.interfaceStability, B: comparisonB.interfaceStability },
    { metric: "Degradation potential", A: comparisonA.degradationPotential, B: comparisonB.degradationPotential },
    { metric: "Confidence", A: comparisonA.confidence, B: comparisonB.confidence },
  ];

  function handleDatasetChange(event) {
    const name = event.target.value;
    setDatasetName(name);
    setStates(datasetLibrary[name]);
    setCsvMessage("Using built-in sample dataset.");
  }

  function handleCSVUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCSV(String(reader.result));
      if (!parsed) {
        setCsvMessage("CSV format not recognised. Required columns: state,label,population,resolution,freeEnergy,rmsd,interface,aiScore");
        return;
      }
      setStates(parsed);
      setDatasetName("Uploaded CSV dataset");
      setCsvMessage(`Loaded ${parsed.length} conformational states from ${file.name}.`);
    };
    reader.readAsText(file);
  }

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
            Dynamic Protein Systems Explorer v2
          </motion.div>
          <motion.h1
            className="hero-title-small"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            Research app for protein motion, cryo-EM states, and AI-guided mechanism
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="hero-text"
          >
            Upload conformational-state data, select sample systems, analyse protein
            sequence features, compare degradation systems, generate mechanistic
            hypotheses, and export research-ready reports.
          </motion.p>

          <div className="hero-actions">
            <a href="#explorer" className="primary-button">Explore workflow</a>
            <a href="#advanced-analysis" className="secondary-button">Analyse data</a>
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
          <h2>From structural states to testable hypotheses</h2>
          <p>
            The app converts heterogeneous structural, simulation, and AI-derived
            signals into ranked mechanistic interpretations for dynamic protein systems.
          </p>
        </motion.div>
      </section>

      <section className="metrics-grid">
        <div className="metric-card"><Microscope /><h3>Time-resolved structure</h3><p>Reaction snapshots, cryo-EM classes, state trajectories.</p></div>
        <div className="metric-card"><Layers /><h3>Heterogeneity</h3><p>Discrete and continuous conformational states.</p></div>
        <div className="metric-card"><Brain /><h3>Deep learning</h3><p>Representation learning, classification, and interpretation.</p></div>
        <div className="metric-card"><Rocket /><h3>Therapeutic relevance</h3><p>E3 ligases, molecular glues, PROTACs, target engagement.</p></div>
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
                  className={`module-button ${selected.id === module.id ? "active" : ""}`}
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
              {selected.workflow.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </motion.article>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-card">
          <h2>Capability map</h2>
          <p>Illustrative capability map for computational structural biology workflows.</p>
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
          <p>Conceptual workflow linking cryo-EM, modelling, MD simulation, and AI interpretation.</p>
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
            Upload a CSV or choose a built-in sample dataset to analyse cryo-EM-like
            conformational states, MD stability, free-energy-like trends, and AI-ranked
            mechanistic hypotheses.
          </p>
        </div>

        <div className="control-panel">
          <div>
            <label>Sample dataset</label>
            <select value={datasetName in datasetLibrary ? datasetName : ""} onChange={handleDatasetChange}>
              {Object.keys(datasetLibrary).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Upload conformational-state CSV</label>
            <label className="file-upload">
              <Upload size={18} />
              Choose CSV
              <input type="file" accept=".csv" onChange={handleCSVUpload} />
            </label>
            <small>{csvMessage}</small>
          </div>
        </div>

        <div className="analysis-summary-grid">
          <div className="analysis-stat"><Activity /><span>Top state</span><strong>{bestState.state}: {bestState.label}</strong></div>
          <div className="analysis-stat"><Target /><span>Mechanistic score</span><strong>{mechanisticScore(bestState).toFixed(1)}/100</strong></div>
          <div className="analysis-stat"><LineChartIcon /><span>Weighted index</span><strong>{weightedMechanisticScore}</strong></div>
          <div className="analysis-stat"><CheckCircle2 /><span>Dataset</span><strong>{datasetName}</strong></div>
        </div>

        <div className="advanced-grid">
          <div className="chart-card">
            <h3>Cryo-EM conformational state populations</h3>
            <p>Particle-class distribution across structural states.</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={states}>
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
            <h3>Free-energy-like landscape</h3>
            <p>Lower values represent more favourable conformational basins.</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name="Coordinate 1" />
                  <YAxis dataKey="y" name="Coordinate 2" />
                  <ZAxis dataKey="z" range={[80, 320]} name="Relative free energy" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={freeEnergyLandscape} name="States">
                    {freeEnergyLandscape.map((entry, i) => (
                      <Cell key={entry.state} fill={["#38bdf8", "#a78bfa", "#22c55e", "#f97316", "#f43f5e"][i % 5]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Molecular dynamics stability trajectory</h3>
            <p>Simulated RMSD and relative energy across a 200 ns trajectory.</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={mdTrajectory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ns" />
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
            <p>Simulated interface contact enrichment during MD simulation.</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={mdTrajectory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ns" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="contacts" name="Interface contacts" stroke="#a78bfa" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Mechanistic score ranking</h3>
            <p>Integrated score derived from population, map quality, interface quality, MD stability, and AI confidence.</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={scoredStates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="mechanisticScore" name="Mechanistic score" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>State contribution</h3>
            <p>AI-score contribution of each conformational state.</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie data={states} dataKey="aiScore" nameKey="state" outerRadius={110} label>
                    {states.map((entry, i) => (
                      <Cell key={entry.state} fill={["#38bdf8", "#a78bfa", "#22c55e", "#f97316", "#f43f5e"][i % 5]} />
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
              <p>Integrated output for structural, simulation, interface, and AI-derived interpretation.</p>
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
                  <th>Free energy</th>
                  <th>RMSD (Å)</th>
                  <th>Interface</th>
                  <th>AI score</th>
                  <th>Mechanistic score</th>
                </tr>
              </thead>
              <tbody>
                {scoredStates.map((row) => (
                  <tr key={row.state}>
                    <td>{row.state}</td>
                    <td>{row.label}</td>
                    <td>{row.population}</td>
                    <td>{row.resolution}</td>
                    <td>{row.freeEnergy}</td>
                    <td>{row.rmsd}</td>
                    <td>{row.interface}</td>
                    <td><strong>{row.aiScore}</strong></td>
                    <td><strong>{row.mechanisticScore}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="interpretation-card">
          <h3>Scoring formula</h3>
          <p>
            Mechanistic score = 0.25 × population score + 0.20 × map quality score
            + 0.20 × interface score + 0.20 × MD stability score + 0.15 × AI confidence score.
          </p>
          <p>
            Map quality is estimated from resolution. MD stability combines relative
            free-energy-like values and RMSD. The score is designed to rank states for
            hypothesis generation, not to replace experimental validation.
          </p>
        </div>

        <div className="interpretation-card">
          <h3>Generated hypothesis</h3>
          <p>{hypothesis}</p>
          <div className="button-row">
            <button className="download-button" onClick={() => downloadCSV(states)}>
              <Download size={18} />
              Download CSV
            </button>
            <button
              className="download-button"
              onClick={() =>
                downloadReport({
                  datasetName,
                  states,
                  bestState,
                  hypothesis,
                  sequenceStats,
                  comparisonA,
                  comparisonB,
                })
              }
            >
              <Download size={18} />
              Download report
            </button>
          </div>
        </div>

        <div className="interpretation-card">
          <h3>Recommended next experiments</h3>
          <ul className="experiment-list">
            {recommendedExperiments(bestState).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="advanced-section">
        <div className="section-header">
          <h2>Protein sequence analysis</h2>
          <p>
            Paste a protein sequence to calculate simple properties relevant to
            structure-function interpretation and possible conformational flexibility.
          </p>
        </div>

        <div className="sequence-grid">
          <textarea
            value={sequence}
            onChange={(event) => setSequence(event.target.value)}
            placeholder="Paste protein sequence here, for example: MKTAYIAKQRQISFVKSHFSRQ..."
          />

          <div className="sequence-results">
            <div><span>Length</span><strong>{sequenceStats.length} aa</strong></div>
            <div><span>Estimated molecular weight</span><strong>{sequenceStats.molecularWeight} Da</strong></div>
            <div><span>Charged residues</span><strong>{sequenceStats.chargedPercent}%</strong></div>
            <div><span>Hydrophobic residues</span><strong>{sequenceStats.hydrophobicPercent}%</strong></div>
            <div><span>Flexible/disorder-associated residues</span><strong>{sequenceStats.flexiblePercent}%</strong></div>
            <p>{sequenceStats.lowComplexityNote}</p>
          </div>
        </div>
      </section>

      <section className="advanced-section">
        <div className="section-header">
          <h2>Conformational transition network</h2>
          <p>
            A simplified transition map linking open, encounter, ligand-stabilised,
            productive, and inactive states. Edge labels represent illustrative transition probabilities.
          </p>
        </div>

        <div className="network-card">
          <div className="node-row">
            {states.map((row, index) => (
              <div className="network-node" key={row.state}>
                <strong>{row.state}</strong>
                <span>{row.label}</span>
                {index < states.length - 1 && <em>p≈{(0.78 - index * 0.09).toFixed(2)} →</em>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="advanced-section">
        <div className="section-header">
          <h2>Comparison mode</h2>
          <p>
            Compare two targeted protein degradation systems using simulated structural,
            interface, degradation, and confidence metrics.
          </p>
        </div>

        <div className="control-panel">
          <div>
            <label>System A</label>
            <select value={comparisonAName} onChange={(e) => setComparisonAName(e.target.value)}>
              {comparisonLibrary.map((x) => <option key={x.system} value={x.system}>{x.system}</option>)}
            </select>
          </div>
          <div>
            <label>System B</label>
            <select value={comparisonBName} onChange={(e) => setComparisonBName(e.target.value)}>
              {comparisonLibrary.map((x) => <option key={x.system} value={x.system}>{x.system}</option>)}
            </select>
          </div>
        </div>

        <div className="chart-card">
          <h3>System comparison</h3>
          <p>Side-by-side comparison of two induced-proximity or degradation systems.</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="A" name={comparisonA.system} fill="#38bdf8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="B" name={comparisonB.system} fill="#a78bfa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section id="application" className="application-section">
        <div className="section-header">
          <h2>App relevance</h2>
          <p>
            This app is designed as a research-facing interface for exploring how dynamic
            protein systems can be analysed through structural biology, molecular simulation,
            and AI-assisted interpretation.
          </p>
        </div>

        <div className="application-grid">
          <div><h3>For cryo-EM analysis</h3><p>The app summarises conformational populations, map quality, particle-class interpretation, and functional state assignment.</p></div>
          <div><h3>For conformational heterogeneity</h3><p>The app treats proteins as ensembles of related structural states, including open, closed, ligand-bound, substrate-bound, inactive, and productive conformations.</p></div>
          <div><h3>For molecular dynamics</h3><p>The app links RMSD, interface contacts, and relative stability to cryo-EM-derived states.</p></div>
          <div><h3>For deep learning workflows</h3><p>The app demonstrates how AI models can rank states, prioritise hypotheses, and organise biological data into explainable outputs.</p></div>
          <div><h3>For E3 ligases, molecular glues, and PROTACs</h3><p>The app models induced proximity as a dynamic structural problem involving ternary-complex stability and conformational state selection.</p></div>
          <div><h3>For research communication</h3><p>The app converts computational structural biology concepts into visual, exportable, and discussion-ready outputs.</p></div>
        </div>
      </section>

      <section className="advanced-section">
        <div className="section-header">
          <h2>Selected peer-reviewed references</h2>
          <p>
            These references provide scientific context for cryo-EM, molecular dynamics,
            targeted protein degradation, molecular glues, and deep learning-based structural biology.
          </p>
        </div>

        <div className="reference-grid">
          {references.map((ref) => (
            <div className="reference-card" key={ref.doi}>
              <h3>{ref.topic}</h3>
              <p>{ref.citation}</p>
              <a href={ref.doi} target="_blank" rel="noreferrer">{ref.doi}</a>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>
          Built as a scientific research app for dynamic structural biology,
          computational biochemistry, and AI-guided protein mechanism.
        </p>
      </footer>
    </main>
  );
}

export default App;
