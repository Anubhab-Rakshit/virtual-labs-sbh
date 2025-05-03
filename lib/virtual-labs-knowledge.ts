export interface KnowledgeItem {
    topic: string
    content: string
  }
  
  export const VIRTUAL_LABS_KNOWLEDGE: KnowledgeItem[] = [
    {
      topic: "Physics Pendulum Lab",
      content:
        "The Physics Pendulum Lab allows students to experiment with simple and double pendulums. Students can adjust parameters like length, mass, gravity, and damping to observe how they affect the pendulum's period and motion patterns. The lab visualizes energy transfer between potential and kinetic energy and demonstrates concepts like conservation of energy, simple harmonic motion, and chaos theory in the case of double pendulums.",
    },
    {
      topic: "Chemistry Titration Lab",
      content:
        "The Chemistry Titration Lab simulates acid-base titration experiments where students can select different acids and bases, adjust concentrations, and observe color changes with various indicators. The virtual lab generates real-time pH curves, helps students identify equivalence points, and teaches concepts like molarity, normality, and acid-base equilibrium without the hazards of handling real chemicals.",
    },
    {
      topic: "Mathematics Fractals Lab",
      content:
        "The Mathematics Fractals Lab enables exploration of infinite geometric patterns and self-similar structures. Students can zoom into famous fractals like the Mandelbrot set, Julia sets, Sierpinski triangle, and Koch snowflake. The lab teaches concepts like complex numbers, iteration, self-similarity, and the mathematical beauty of chaos. Students can modify parameters to create their own fractal variations and observe how simple rules can generate incredible complexity.",
    },
    {
      topic: "Wave Interference Lab",
      content:
        "The Wave Interference Lab demonstrates the principles of wave superposition, constructive and destructive interference. Students can create virtual ripple tanks with multiple wave sources, adjust wavelength, amplitude, and frequency, and observe the resulting interference patterns. The lab helps visualize concepts that can be difficult to demonstrate in physical settings and connects to topics in sound, light, and quantum physics.",
    },
    {
      topic: "Cell Explorer Lab",
      content:
        "The Cell Explorer Lab provides an interactive 3D visualization of cellular structures and processes. Students can examine organelles in plant, animal, and bacterial cells, observe dynamic processes like mitosis, meiosis, protein synthesis, and photosynthesis. The lab includes detailed information about each cellular component and allows students to compare different cell types.",
    },
    {
      topic: "DNA Replication Lab",
      content:
        "The DNA Replication Lab simulates the process of DNA replication at the molecular level. Students can observe the unwinding of the double helix, the action of DNA polymerase, leading and lagging strand synthesis, and the role of various enzymes in the replication process. The lab includes interactive activities to reinforce understanding of semiconservative replication and genetic fidelity.",
    },
    {
      topic: "Neural Network Visualization",
      content:
        "The Neural Network Visualization Lab allows students to build and train simple neural networks. Students can create networks with different architectures, observe the training process in real-time, and see how neural networks learn to recognize patterns. The lab provides insights into machine learning concepts like backpropagation, activation functions, and gradient descent without requiring programming knowledge.",
    },
    {
      topic: "Doppler Effect Lab",
      content:
        "The Doppler Effect Lab simulates how sound waves change frequency when a source or observer is moving. Students can adjust the speed of the sound source, the speed of the observer, and observe the resulting wave patterns and frequency shifts. The lab helps students understand concepts important in astronomy, acoustics, and medical ultrasound applications.",
    },
    {
      topic: "Buffer Solution Lab",
      content:
        "The Buffer Solution Lab allows students to create various buffer solutions and test their ability to resist pH changes. Students can add acids and bases to buffers of different compositions and concentrations, observe pH changes in real-time, and learn about buffer capacity and the Henderson-Hasselbalch equation. The lab helps students understand the importance of buffers in biological systems and laboratory procedures.",
    },
    {
      topic: "Chaos Theory Lab",
      content:
        "The Chaos Theory Lab demonstrates how simple deterministic systems can exhibit complex, chaotic behavior. Students can explore famous chaotic systems like the logistic map, the Lorenz attractor, and the double pendulum. The lab illustrates concepts like sensitivity to initial conditions (the butterfly effect), strange attractors, and the emergence of complex patterns from simple rules.",
    },
    {
      topic: "Virtual Labs Platform Features",
      content:
        "The Virtual Labs platform includes features like progress tracking, interactive 3D simulations, real-time data visualization, and comprehensive educational resources. Students can access labs from any device with a web browser, save their work for later, and receive personalized feedback. The platform supports both guided learning paths and open exploration, allowing educators to assign specific experiments or let students discover concepts at their own pace.",
    },
    {
      topic: "Student Dashboard",
      content:
        "The Student Dashboard provides a comprehensive overview of learning progress and activity. Features include: completed labs tracking, upcoming assignments view, study streak monitoring, time spent analytics across different subjects, performance insights with strength and weakness identification, skill radar charts showing proficiency across topics, and personalized learning path recommendations based on student performance and interests.",
    },
    {
      topic: "Lab Accessibility Features",
      content:
        "Virtual Labs is designed to be accessible to all students. The platform includes features like screen reader compatibility, keyboard navigation support, color contrast adjustments, text-to-speech functionality, and the ability to adjust simulation speeds. These accessibility features ensure that students with different abilities can fully participate in virtual laboratory experiences.",
    },
    {
      topic: "Teacher Dashboard",
      content:
        "The Teacher Dashboard allows educators to monitor student progress, assign specific labs and experiments, view analytics on class performance, identify concepts that need reinforcement, and create custom learning paths. Teachers can also provide feedback directly through the platform and export student performance data for grading purposes.",
    },
    {
      topic: "Using Virtual Labs",
      content:
        "To use a Virtual Lab, students first select an experiment from the main dashboard or subject category pages. Each lab begins with an introduction explaining the scientific concepts and objectives. Interactive controls allow students to adjust parameters, run simulations, collect data, and analyze results. Labs include guided questions and activities to reinforce learning objectives, and students can save their work to revisit later or submit for assessment.",
    },
  ]
  
  // Extended function to get context about a specific topic or query
  export function getLabKnowledge(query: string): string {
    const lowerQuery = query.toLowerCase()
  
    // Find matches in knowledge base
    const matches = VIRTUAL_LABS_KNOWLEDGE.filter(
      (item) => lowerQuery.includes(item.topic.toLowerCase()) || item.content.toLowerCase().includes(lowerQuery),
    )
  
    // Return combined context or empty string if no matches
    if (matches.length > 0) {
      return matches.map((item) => `${item.topic}:\n${item.content}`).join("\n\n")
    }
  
    // If no specific match, return general information about Virtual Labs
    const generalItems = VIRTUAL_LABS_KNOWLEDGE.filter(
      (item) => item.topic.includes("Virtual Labs Platform") || item.topic.includes("Using Virtual Labs"),
    )
  
    if (generalItems.length > 0) {
      return generalItems.map((item) => `${item.topic}:\n${item.content}`).join("\n\n")
    }
  
    return ""
  }
  