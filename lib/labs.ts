import type { Lab } from "@/types/lab"

// Mock database of labs
const labsData: Lab[] = [
  {
      id: "1",
      slug: "electric-generator",
      link: "https://physics-lab-generator.vercel.app/",
      title: "Electromagnetic Induction: Electric Generator",
      description:
        "Investigate how mechanical energy is converted into electrical energy using electromagnetic induction. Explore how changing magnetic flux induces current in a coil.",
      category: "physics",
      difficulty: "Intermediate",
      duration: "40 minutes",
      thumbnail: "/generator.png",
      learningObjectives: [
        "Understand the principle of electromagnetic induction",
        "Explore the relationship between magnetic flux and induced current",
        "Analyze how coil turns, magnet speed, and orientation affect current",
        "Apply Faraday's Law and Lenz's Law to predict induced voltage",
      ],
      prerequisites: "Basic understanding of magnetism, electric current, and Faraday's Law",
      instructions: [
        {
          title: "Set up the generator",
          description:
            "Attach a copper coil near a rotating magnet. You can adjust the number of coil turns (e.g., 100–1000) and the rotation speed of the magnet.",
        },
        {
          title: "Rotate the magnet",
          description:
            "Start rotating the magnet manually or with a motor. Ensure consistent rotation to observe steady results. Note how faster rotations generate higher currents.",
        },
        {
          title: "Observe the bulb",
          description:
            "Connect a small LED bulb to the coil circuit. Observe how the bulb brightness changes with magnet speed and number of coil turns.",
        },
        {
          title: "Measure induced voltage",
          description:
            "Use a virtual voltmeter to measure the voltage across the coil. Record how voltage varies with magnetic flux changes over time.",
        },
        {
          title: "Apply electromagnetic laws",
          description:
            "Use Faraday's Law (ε = -N dΦ/dt) to calculate the expected voltage. Compare with your measured values and consider possible discrepancies.",
        },
      ],
      resources: [
        {
          title: "Faraday's Law of Induction",
          url: "https://en.wikipedia.org/wiki/Faraday%27s_law_of_induction",
        },
        {
          title: "Video: How Generators Work",
          url: "https://www.youtube.com/watch?v=example-generator",
        },
        {
          title: "Interactive Generator Simulation",
          url: "https://phet.colorado.edu/en/simulation/faradays-law",
        },
      ],
      relatedLabs: [
        {
          slug: "physics-magnetic-fields",
          title: "Mapping Magnetic Fields",
          thumbnail: "/magnetic-field-lines.jpeg",
          category: "physics",
        },
        {
          slug: "physics-ac-dc-current",
          title: "AC vs DC Electricity",
          thumbnail: "/ac-dc-current.png",
          category: "physics",
        },
      ],
    },
  {
    id: "2",
    slug: "chemistry-titration",
    link: "https://ph-scale-lab.vercel.app/",
    title: "Acid-Base Titration",
    description:
      "Perform a virtual acid-base titration experiment to determine the concentration of an unknown acid or base solution.",
    category: "chemistry",
    difficulty: "Intermediate",
    duration: "45 minutes",
    thumbnail: "/ph-lab.jpeg",
    learningObjectives: [
      "Understand the principles of acid-base titration",
      "Learn how to use indicators to determine the endpoint",
      "Calculate the concentration of an unknown solution",
      "Interpret titration curves and understand equivalence points",
    ],
    prerequisites: "Basic understanding of acids, bases, and molarity calculations",
    instructions: [
      {
        title: "Prepare your solutions",
        description:
          "Select your acid and base solutions from the available options. For this experiment, we'll use a sodium hydroxide (NaOH) solution of known concentration and an unknown concentration of hydrochloric acid (HCl).",
      },
      {
        title: "Set up the titration apparatus",
        description:
          "Fill the burette with the NaOH solution. Place the HCl solution in the Erlenmeyer flask and add a few drops of phenolphthalein indicator.",
      },
      {
        title: "Perform the titration",
        description:
          "Slowly add the NaOH solution to the flask, swirling gently. Continue until the solution turns a pale pink color, indicating the endpoint has been reached.",
      },
      {
        title: "Record your data",
        description:
          "Note the initial and final volumes of NaOH in the burette. The difference is the volume of NaOH added to reach the endpoint.",
      },
      {
        title: "Calculate the concentration",
        description:
          "Using the formula MₐVₐ = MᵦVᵦ, calculate the concentration of the HCl solution, where M is molarity and V is volume.",
      },
    ],
    resources: [
      {
        title: "Acid-Base Titration Principles",
        url: "https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Supplemental_Modules_(Analytical_Chemistry)/Quantifying_Nature/Quantitative_Measurements/Titration",
      },
      {
        title: "Video Tutorial: Performing a Titration",
        url: "https://www.youtube.com/watch?v=example2",
      },
      {
        title: "Interactive pH Calculator",
        url: "https://www.chembuddy.com/?left=pH-calculation",
      },
    ],
    relatedLabs: [
      {
        slug: "chemistry-buffer-solutions",
        title: "Buffer Solutions",
        thumbnail: "/buffer-solution-lab.png",
        category: "chemistry",
      },
      {
        slug: "chemistry-spectroscopy",
        title: "Spectroscopic Analysis",
        thumbnail: "/spectroscopy-lab.png",
        category: "chemistry",
      },
    ],
  },
  {
    id: "3",
    slug: "math-curve-fitting",
    link: "https://curve-fitting-lab.vercel.app/",
    title: "Interactive Curve Fitting Lab",
    description:
      "Experiment with curve fitting by adjusting parameters and observing how different functions—linear, quadratic, and cubic—fit to custom datasets. Drag and drop data points for hands-on exploration.",
    category: "mathematics",
    difficulty: "Intermediate",
    duration: "45 minutes",
    thumbnail: "/curve-fitting.png",
    learningObjectives: [
      "Understand the principles of curve fitting using polynomial functions",
      "Learn how parameters affect linear, quadratic, and cubic curves",
      "Interactively manipulate data points and observe fitting results",
      "Explore the role of error minimization in regression analysis",
    ],
    prerequisites: "Familiarity with functions, graphs, and basic algebra",
    instructions: [
      {
        title: "Select the type of curve",
        description:
          "Choose between linear (y = ax + b), quadratic (y = ax² + bx + c), or cubic (y = ax³ + bx² + cx + d) functions to fit to your dataset.",
      },
      {
        title: "Adjust the parameters",
        description:
          "Use sliders to modify parameters a, b, c, and d. Watch how the curve updates in real time to reflect the changes.",
      },
      {
        title: "Drag and drop data points",
        description:
          "Interactively drag data points on the graph to create custom datasets. The curve will refit automatically based on the new data.",
      },
      {
        title: "Minimize fitting error",
        description:
          "Enable 'Auto Fit' to let the system find the best-fitting parameters by minimizing the error (e.g., using least squares method).",
      },
      {
        title: "Compare different models",
        description:
          "Switch between different curve types and compare how well each model fits the data. Discuss underfitting and overfitting scenarios.",
      },
    ],
    resources: [
      {
        title: "Introduction to Curve Fitting",
        url: "https://en.wikipedia.org/wiki/Curve_fitting",
      },
      {
        title: "Video: Polynomial Regression Explained",
        url: "https://www.youtube.com/watch?v=example4",
      },
      {
        title: "Interactive Regression Tools",
        url: "https://www.desmos.com/calculator",
      },
    ],
    relatedLabs: [
      {
        slug: "math-least-squares",
        title: "Least Squares Method",
        thumbnail: "/least-square-method.png",
        category: "mathematics",
      },
      {
        slug: "math-data-visualization",
        title: "Data Visualization Techniques",
        thumbnail: "/data-visualization.jpeg",
        category: "mathematics",
      },
    ],
  }
,  
{
  id: "4",
  slug: "physics-pendulum",
  link: "https://virtual-labs-sbh.vercel.app/labs/physics/pendulum",
  title: "Simple Pendulum Experiment",
  description:
    "Explore the physics of a simple pendulum and understand the relationship between length, gravity, and period of oscillation.",
  category: "physics",
  difficulty: "Beginner",
  duration: "30 minutes",
  thumbnail: "/pendulum.png",
  learningObjectives: [
    "Understand the relationship between pendulum length and period",
    "Learn how to calculate gravitational acceleration using a pendulum",
    "Explore the concept of simple harmonic motion",
    "Analyze experimental data and calculate error margins",
  ],
  prerequisites: "Basic understanding of trigonometry and Newton's laws of motion",
  instructions: [
    {
      title: "Set up the pendulum",
      description:
        "Adjust the length of the pendulum using the slider. You can set it between 0.1m and 2.0m. The bob mass can also be adjusted, though it doesn't affect the period in ideal conditions.",
    },
    {
      title: "Start the oscillation",
      description:
        "Pull the pendulum to the side (small angles only for simple harmonic motion) and release it by clicking the 'Release' button. Observe the motion carefully.",
    },
    {
      title: "Measure the period",
      description:
        "Use the built-in stopwatch to measure the time it takes for the pendulum to complete 10 full oscillations. Divide by 10 to get the period of one oscillation.",
    },
    {
      title: "Calculate gravitational acceleration",
      description:
        "Using the formula T = 2π√(L/g), calculate the value of g (gravitational acceleration) based on your measurements of period (T) and length (L).",
    },
    {
      title: "Analyze error sources",
      description:
        "Consider what factors might introduce errors in your measurements and calculations. How could the experiment be improved?",
    },
  ],
  resources: [
    {
      title: "Simple Pendulum Theory",
      url: "https://en.wikipedia.org/wiki/Pendulum",
    },
    {
      title: "Video Tutorial: Measuring Gravity with a Pendulum",
      url: "https://www.youtube.com/watch?v=example",
    },
    {
      title: "Interactive Pendulum Simulator",
      url: "https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html",
    },
  ],
  relatedLabs: [
    {
      slug: "physics-wave-interference",
      title: "Wave Interference Patterns",
      thumbnail: "/water-wave-interference.png",
      category: "physics",
    },
    {
      slug: "physics-double-pendulum",
      title: "Chaotic Double Pendulum",
      thumbnail: "/chaotic-double-pendulum.png",
      category: "physics",
    },
  ],
},
  {
    id: "5",
    slug: "computer-neural-networks",
    link: "https://virtual-labs-sbh.vercel.app/labs/computer-neural-networks",
    title: "Neural Network Visualization",
    description:
      "Explore how neural networks learn patterns and make predictions through an interactive visualization of network architecture and training.",
    category: "computer",
    difficulty: "Advanced",
    duration: "75 minutes",
    thumbnail: "/neural-network-visualization.png",
    learningObjectives: [
      "Understand the basic architecture of neural networks",
      "Visualize how information flows through network layers",
      "Explore how networks learn through backpropagation",
      "Experiment with different network configurations for various tasks",
    ],
    prerequisites: "Basic understanding of linear algebra and calculus",
    instructions: [
      {
        title: "Design your network",
        description:
          "Use the interactive builder to create a neural network. Add input nodes, hidden layers, and output nodes based on your problem requirements.",
      },
      {
        title: "Select a dataset",
        description:
          "Choose from available datasets like MNIST (handwritten digits), Fashion MNIST (clothing items), or create your own simple dataset for classification or regression.",
      },
      {
        title: "Train the network",
        description:
          "Start the training process and observe how the network adjusts its weights and biases. You can pause at any point to examine the current state.",
      },
      {
        title: "Visualize activations",
        description:
          "Select any node to see its activation patterns across different inputs. For hidden layers, visualize what features they're detecting.",
      },
      {
        title: "Test and evaluate",
        description:
          "Test your trained network on new data and evaluate its performance. Try modifying the architecture or hyperparameters to improve results.",
      },
    ],
    resources: [
      {
        title: "Neural Networks Fundamentals",
        url: "https://www.3blue1brown.com/topics/neural-networks",
      },
      {
        title: "Video Tutorial: Backpropagation Explained",
        url: "https://www.youtube.com/watch?v=example4",
      },
      {
        title: "Interactive Neural Network Playground",
        url: "https://playground.tensorflow.org/",
      },
    ],
    relatedLabs: [
      {
        slug: "computer-machine-learning",
        title: "Introduction to Machine Learning",
        thumbnail: "/machine-learning-lab.png",
        category: "computer",
      },
      {
        slug: "computer-computer-vision",
        title: "Computer Vision Basics",
        thumbnail: "/computer-vision-lab.png",
        category: "computer",
      },
    ],
  },
  {
    id: "6",
    slug: "biology-cell-explorer",
    link: "https://virtual-labs-sbh.vercel.app/labs/biology-cell-explorer",
    title: "Interactive Cell Explorer",
    description:
      "Journey inside a human cell to explore its structures, functions, and the complex processes that sustain life at the cellular level.",
    category: "biology",
    difficulty: "Intermediate",
    duration: "50 minutes",
    thumbnail: "/cell-explorer.png",
    learningObjectives: [
      "Identify and understand the functions of major cell organelles",
      "Visualize cellular processes like protein synthesis and energy production",
      "Explore differences between prokaryotic and eukaryotic cells",
      "Understand how cells respond to their environment",
    ],
    prerequisites: "Basic understanding of biology and cell theory",
    instructions: [
      {
        title: "Navigate the cell",
        description:
          "Use the interactive 3D model to navigate through different parts of the cell. Click on any organelle to zoom in and learn more about its structure and function.",
      },
      {
        title: "Observe cellular processes",
        description:
          "Start the simulation to observe dynamic cellular processes in real-time. You can speed up, slow down, or pause the simulation at any point.",
      },
      {
        title: "Investigate organelle interactions",
        description:
          "Select specific organelles to highlight their interactions with other cell components. For example, see how the endoplasmic reticulum and Golgi apparatus work together in protein processing.",
      },
      {
        title: "Compare cell types",
        description:
          "Switch between different cell types (animal, plant, bacterial) to compare their structures and specialized functions.",
      },
      {
        title: "Simulate environmental changes",
        description:
          "Adjust environmental parameters like temperature, pH, or nutrient availability to observe how the cell responds to different conditions.",
      },
    ],
    resources: [
      {
        title: "Cell Biology Fundamentals",
        url: "https://www.khanacademy.org/science/biology/structure-of-a-cell",
      },
      {
        title: "Video Tutorial: Journey Inside the Cell",
        url: "https://www.youtube.com/watch?v=example5",
      },
      {
        title: "Interactive Cell Diagram",
        url: "https://learn.genetics.utah.edu/content/cells/insideacell/",
      },
    ],
    relatedLabs: [
      {
        slug: "biology-dna-replication",
        title: "DNA Replication and Protein Synthesis",
        thumbnail: "/dna-replication-lab.png",
        category: "biology",
      },
      {
        slug: "biology-microscopy",
        title: "Virtual Microscopy Lab",
        thumbnail: "/microscopy-lab.png",
        category: "biology",
      },
    ],
  },
  {
    id: "7",
    slug: "physics-wave-interference",
    link: "https://virtual-labs-sbh.vercel.app/labs/computer-neural-networks/physics-wave-interference",
    title: "Wave Interference Patterns",
    description:
      "Explore the fascinating patterns created when waves interact, and understand the principles of constructive and destructive interference.",
    category: "physics",
    difficulty: "Intermediate",
    duration: "40 minutes",
    thumbnail: "/water-wave-interference.png",
    learningObjectives: [
      "Understand the principles of wave superposition",
      "Visualize constructive and destructive interference patterns",
      "Explore how wavelength and source separation affect interference patterns",
      "Apply interference concepts to sound waves, water waves, and light",
    ],
    prerequisites: "Basic understanding of waves, frequency, and wavelength",
    instructions: [
      {
        title: "Set up wave sources",
        description:
          "Position two or more wave sources in the simulation area. You can adjust their separation distance using the controls.",
      },
      {
        title: "Adjust wave parameters",
        description:
          "Modify the wavelength, amplitude, and frequency of the waves using the sliders. Observe how these changes affect the interference pattern.",
      },
      {
        title: "Observe interference patterns",
        description:
          "Start the simulation and observe the resulting interference pattern. Identify areas of constructive interference (where waves add together) and destructive interference (where waves cancel out).",
      },
      {
        title: "Measure nodal lines",
        description:
          "Use the measurement tool to determine the spacing between nodal lines (areas of destructive interference). Verify that this matches theoretical predictions.",
      },
      {
        title: "Apply to different wave types",
        description:
          "Switch between different types of waves (water, sound, light) to see how interference manifests in different physical systems.",
      },
    ],
    resources: [
      {
        title: "Wave Interference Principles",
        url: "https://www.physicsclassroom.com/class/waves/Lesson-3/Interference-of-Waves",
      },
      {
        title: "Video Tutorial: Understanding Wave Interference",
        url: "https://www.youtube.com/watch?v=example6",
      },
      {
        title: "Interactive Wave Simulator",
        url: "https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html",
      },
    ],
    relatedLabs: [
      {
        slug: "physics-pendulum",
        title: "Simple Pendulum Experiment",
        thumbnail: "/pendulum-motion.png",
        category: "physics",
      },
      {
        slug: "physics-doppler-effect",
        title: "Doppler Effect Simulation",
        thumbnail: "/doppler-effect-lab.png",
        category: "physics",
      },
    ],
  },
]



const TRANSLATION_API = "https://15eb-2401-4900-7084-3f05-4c2d-447c-ba96-7f06.ngrok-free.app/api/translate/";

async function translate(text: string, target: string): Promise<string> {
  const response = await fetch(TRANSLATION_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, target }),
  });

  if (!response.ok) {
    console.error(`Failed to translate "${text}" to "${target}"`);
    return text; // fallback to original
  }

  const data = await response.json();
  return data.translated_text || text;
}

export async function getTranslatedLabs(data: Lab[]): Promise<Lab[]> {
  const targetLang = localStorage.getItem("selectedLanguage") || "en";

  if (targetLang === "en") return labsData;

  const translatedLabs: Lab[] = await Promise.all(
    data.map(async (lab) => {
      const translatedTitle = await translate(lab.title, targetLang);
      const translatedDescription = await translate(lab.description, targetLang);
      const translatedPrerequisites = await translate(lab.prerequisites, targetLang);

      const translatedLearningObjectives = await Promise.all(
        lab.learningObjectives.map((obj) => translate(obj, targetLang))
      );

      const translatedInstructions = await Promise.all(
        lab.instructions.map(async (step) => ({
          title: await translate(step.title, targetLang),
          description: await translate(step.description, targetLang),
        }))
      );

      const translatedResources = await Promise.all(
        lab.resources.map(async (res) => ({
          title: await translate(res.title, targetLang),
          url: res.url,
        }))
      );

      const translatedRelatedLabs = await Promise.all(
        lab.relatedLabs.map(async (related) => ({
          ...related,
          title: await translate(related.title, targetLang),
        }))
      );

      const data = {
        ...lab,
        title: translatedTitle,
        description: translatedDescription,
        prerequisites: translatedPrerequisites,
        learningObjectives: translatedLearningObjectives,
        instructions: translatedInstructions,
        resources: translatedResources,
        relatedLabs: translatedRelatedLabs,
      };
      return data;
    })
  );
  return translatedLabs;
}


/*
export async function getAllLabs(): Promise<Lab[]> {
  const targetLang = localStorage.getItem("selectedLanguage") || "en";

  if (targetLang === "en") return labsData;

  const translatedLabs: Lab[] = await Promise.all(
    labsData.map(async (lab) => {
      const translatedTitle = await translate(lab.title, targetLang);
      const translatedDescription = await translate(lab.description, targetLang);
      const translatedPrerequisites = await translate(lab.prerequisites, targetLang);

      const translatedLearningObjectives = await Promise.all(
        lab.learningObjectives.map((obj) => translate(obj, targetLang))
      );

      const translatedInstructions = await Promise.all(
        lab.instructions.map(async (step) => ({
          title: await translate(step.title, targetLang),
          description: await translate(step.description, targetLang),
        }))
      );

      const translatedResources = await Promise.all(
        lab.resources.map(async (res) => ({
          title: await translate(res.title, targetLang),
          url: res.url,
        }))
      );

      const translatedRelatedLabs = await Promise.all(
        lab.relatedLabs.map(async (related) => ({
          ...related,
          title: await translate(related.title, targetLang),
        }))
      );

      const data = {
        ...lab,
        title: translatedTitle,
        description: translatedDescription,
        prerequisites: translatedPrerequisites,
        learningObjectives: translatedLearningObjectives,
        instructions: translatedInstructions,
        resources: translatedResources,
        relatedLabs: translatedRelatedLabs,
      };
      return data;
    })
  );
  return translatedLabs;
}
*/

// Get all labs
export async function getAllLabs(): Promise<Lab[]> {
  // In a real app, this would fetch from an API or database
  return getTranslatedLabs(labsData);
}

// Get labs by category
export async function getLabsByCategory(category: string): Promise<Lab[]> {
  return getTranslatedLabs(labsData.filter((lab) => lab.category === category))
}

// Get a single lab by slug
export async function getLabBySlug(slug: string): Promise<Lab | null> {
  const lab = labsData.find((lab) => lab.slug === slug);
  if (!lab) return null;

  const [translatedLab] = await getTranslatedLabs([lab]);
  return translatedLab;

}

// Search labs
export async function searchLabs(query: string): Promise<Lab[]> {
  const lowercaseQuery = query.toLowerCase()
  return labsData.filter(
    (lab) =>
      lab.title.toLowerCase().includes(lowercaseQuery) ||
      lab.description.toLowerCase().includes(lowercaseQuery) ||
      lab.category.toLowerCase().includes(lowercaseQuery),
  )
}

// Get featured labs
export async function getFeaturedLabs(): Promise<Lab[]> {
  // For now, just return the first 3 labs
  return labsData.slice(0, 3)
}
