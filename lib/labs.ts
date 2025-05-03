import type { Lab } from "@/types/lab"

// Mock database of labs
const labsData: Lab[] = [
  {
    id: "1",
    slug: "physics-pendulum",
    title: "Simple Pendulum Experiment",
    description:
      "Explore the physics of a simple pendulum and understand the relationship between length, gravity, and period of oscillation.",
    category: "physics",
    difficulty: "Beginner",
    duration: "30 minutes",
    thumbnail: "/pendulum-motion.png",
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
    id: "2",
    slug: "chemistry-titration",
    title: "Acid-Base Titration",
    description:
      "Perform a virtual acid-base titration experiment to determine the concentration of an unknown acid or base solution.",
    category: "chemistry",
    difficulty: "Intermediate",
    duration: "45 minutes",
    thumbnail: "/colorful-titration-experiment.png",
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
    slug: "math-fractals",
    title: "Fractal Explorer",
    description:
      "Explore the fascinating world of fractals, including the Mandelbrot set, Julia sets, and other mathematical patterns with infinite complexity.",
    category: "mathematics",
    difficulty: "Advanced",
    duration: "60 minutes",
    thumbnail: "/kaleidoscopic-mandelbrot.png",
    learningObjectives: [
      "Understand the concept of self-similarity in mathematical structures",
      "Explore the Mandelbrot and Julia sets through interactive visualization",
      "Learn about complex numbers and iterative functions",
      "Discover the applications of fractals in nature, art, and computer science",
    ],
    prerequisites: "Basic understanding of complex numbers and iterative functions",
    instructions: [
      {
        title: "Explore the Mandelbrot set",
        description:
          "Use the interactive viewer to explore the Mandelbrot set. You can zoom in on interesting regions by clicking and dragging to create a selection box.",
      },
      {
        title: "Adjust the parameters",
        description:
          "Experiment with different color schemes and iteration counts using the control panel. Higher iteration counts provide more detail but require more processing power.",
      },
      {
        title: "Generate Julia sets",
        description:
          "Click on any point in the Mandelbrot set to generate the corresponding Julia set. Notice how different points produce dramatically different patterns.",
      },
      {
        title: "Investigate other fractal types",
        description:
          "Switch between different fractal types using the dropdown menu. Try exploring the Burning Ship fractal, Tricorn, or Newton fractals.",
      },
      {
        title: "Save and share your discoveries",
        description:
          "When you find an interesting region, you can save the image or share the exact coordinates with others so they can explore the same area.",
      },
    ],
    resources: [
      {
        title: "The Mathematics of Fractals",
        url: "https://en.wikipedia.org/wiki/Fractal",
      },
      {
        title: "Video Tutorial: Understanding the Mandelbrot Set",
        url: "https://www.youtube.com/watch?v=example3",
      },
      {
        title: "Interactive Fractal Generator",
        url: "https://fractalfoundation.org/resources/fractivities/",
      },
    ],
    relatedLabs: [
      {
        slug: "math-chaos-theory",
        title: "Introduction to Chaos Theory",
        thumbnail: "/chaos-theory-lab.png",
        category: "mathematics",
      },
      {
        slug: "math-golden-ratio",
        title: "The Golden Ratio in Nature",
        thumbnail: "/golden-ratio-lab.png",
        category: "mathematics",
      },
    ],
  },
  {
    id: "4",
    slug: "computer-neural-networks",
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
    id: "5",
    slug: "biology-cell-explorer",
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
    id: "6",
    slug: "physics-wave-interference",
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

// Get all labs
export async function getAllLabs(): Promise<Lab[]> {
  // In a real app, this would fetch from an API or database
  return labsData
}

// Get labs by category
export async function getLabsByCategory(category: string): Promise<Lab[]> {
  return labsData.filter((lab) => lab.category === category)
}

// Get a single lab by slug
export async function getLabBySlug(slug: string): Promise<Lab | null> {
  const lab = labsData.find((lab) => lab.slug === slug)
  return lab || null
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
