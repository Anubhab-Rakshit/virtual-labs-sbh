import fs from "fs"
import path from "path"

/**
 * Prepares training data for the Gemini model
 * This is meant to be run as a script, not in the browser
 */
export async function prepareTrainingData(contentPath: string, outputPath: string) {
  try {
    // Read scraped content
    const rawData = fs.readFileSync(path.join(process.cwd(), contentPath), "utf-8")
    const websiteContent = JSON.parse(rawData)

    // Format content for training
    const trainingData = websiteContent.map((page: any) => ({
      input: `Please provide information about ${page.title}`,
      output: `
        # ${page.title}
        
        ${page.description}
        
        ${page.content}
        
        This information is from: ${page.url}
      `,
    }))

    // Add general questions
    const generalQuestions = [
      {
        input: "What is Virtual Labs?",
        output:
          "Virtual Labs is an educational platform that offers interactive virtual laboratory experiences in Physics, Chemistry, Mathematics, Computer Science, and Biology. It allows students to conduct experiments safely online and learn through immersive simulations.",
      },
      {
        input: "What subjects do you cover?",
        output:
          "Virtual Labs covers five main subject areas: Physics, Chemistry, Mathematics, Computer Science, and Biology. Each subject area contains multiple interactive labs and simulations.",
      },
      {
        input: "How do I use a lab?",
        output:
          "To use a lab, navigate to the Labs section, select the lab you're interested in, and click on it to view details. From there, you can launch the lab by clicking the 'Launch Lab' button. Each lab includes instructions and interactive elements you can manipulate.",
      },
      // Add more general Q&A pairs as needed
    ]

    // Combine all training data
    const allTrainingData = [...trainingData, ...generalQuestions]

    // Save to JSON file
    fs.writeFileSync(path.join(process.cwd(), outputPath), JSON.stringify(allTrainingData, null, 2))

    console.log(`Training data prepared and saved to ${outputPath}`)
  } catch (error) {
    console.error("Error preparing training data:", error)
  }
}

// Example usage (uncomment to run):
// prepareTrainingData("data/website-content.json", "data/training-data.json")
