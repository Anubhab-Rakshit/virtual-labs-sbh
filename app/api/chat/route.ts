import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getLabKnowledge } from "@/lib/virtual-labs-knowledge"

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Enhanced system prompt with detailed Virtual Labs context
const SYSTEM_PROMPT = `You are the Virtual Labs Assistant, specifically designed to provide information ONLY about the Virtual Labs educational platform.

IMPORTANT: You must ONLY answer questions related to Virtual Labs, its experiments, scientific concepts covered in the labs, and how to use the platform. If a user asks about anything outside this scope, politely redirect them back to Virtual Labs topics.

About Virtual Labs:
- Virtual Labs is an educational platform offering interactive virtual laboratory experiences across multiple scientific disciplines.
- The platform covers Physics, Chemistry, Mathematics, Computer Science, and Biology.
- Each lab contains interactive simulations, experiments, and educational content.
- Students can perform experiments virtually that would be difficult, expensive, or dangerous in real life.
- The platform includes a student dashboard to track progress and learning outcomes.

Available Lab Categories:
1. Physics Labs: Pendulum experiments, wave interference, doppler effect, mechanics simulations, etc.
2. Chemistry Labs: Titration experiments, spectroscopy, buffer solutions, chemical reactions, etc.
3. Mathematics Labs: Fractal explorations, geometric visualizations, chaos theory, golden ratio, etc.
4. Computer Science Labs: Neural network visualizations, computer vision, AI experimentation, etc.
5. Biology Labs: Cell exploration, DNA replication, microscopy, genetics, etc.

Features of the Platform:
- Interactive 3D simulations
- Real-time data visualization
- Progress tracking and analytics
- Educational resources and theory sections
- Student assessments and quizzes

If asked about anything not related to Virtual Labs or scientific education, respond with:
"I'm your Virtual Labs Assistant. I can help you with questions about our virtual experiments, scientific concepts, or how to use our platform. What would you like to know about Virtual Labs?"

Your goal is to help students and educators get the most out of the Virtual Labs platform and its educational content.`

// Function to detect off-topic queries
function isOffTopic(query: string): boolean {
  const virtualLabsKeywords = [
    "lab",
    "virtual",
    "experiment",
    "simulation",
    "physics",
    "chemistry",
    "biology",
    "mathematics",
    "computer",
    "science",
    "pendulum",
    "titration",
    "fractal",
    "cell",
    "dashboard",
    "platform",
    "student",
    "progress",
    "microscopy",
    "wave",
    "interference",
    "doppler",
    "neural",
    "dna",
    "learn",
    "education",
    "study",
    "teaching",
    "academic",
    "school",
    "university",
    "college",
    "course",
    "lesson",
    "assignment",
    "homework",
    "test",
    "exam",
    "quiz",
    "grade",
    "report",
    "streak",
    "achievement",
    "performance",
  ]

  const lowerQuery = query.toLowerCase()

  // Check if query contains any Virtual Labs related keywords
  const containsKeyword = virtualLabsKeywords.some((keyword) => lowerQuery.includes(keyword))

  // Short queries might be follow-ups, so don't consider them off-topic
  if (lowerQuery.split(" ").length < 4) {
    return false
  }

  return !containsKeyword
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // Extract the last user message
    const lastMessage = messages[messages.length - 1]
    const userQuery = lastMessage.content

    // Get relevant knowledge about Virtual Labs based on the query
    const relevantKnowledge = getLabKnowledge(userQuery)

    // Prepare conversation for Gemini with enhanced context
    let prompt = ""

    // Check if query might be off-topic
    if (isOffTopic(userQuery)) {
      prompt = `${SYSTEM_PROMPT}\n\n[IMPORTANT REMINDER: The user's question appears to be off-topic. Please politely redirect them to Virtual Labs topics.]\n\nUser query: ${userQuery}`
    } else {
      prompt = `${SYSTEM_PROMPT}\n\n${relevantKnowledge ? `Relevant information about Virtual Labs:\n${relevantKnowledge}\n\n` : ""}User query: ${userQuery}`
    }

    // Include conversation history for context (last 3 exchanges maximum to avoid token limits)
    if (messages.length > 1) {
      const recentMessages = messages.slice(-7, -1) // Get up to 6 recent messages (3 exchanges) excluding the last one
      const conversationHistory = recentMessages
        .map((msg) => `${msg.role === "user" ? "User" : "Virtual Labs Assistant"}: ${msg.content}`)
        .join("\n")

      prompt = `${prompt}\n\nRecent conversation:\n${conversationHistory}`
    }

    // Final reminder to stay on topic
    prompt +=
      "\n\nREMINDER: You are the Virtual Labs Assistant. Only provide information related to the Virtual Labs platform, its experiments, or relevant scientific concepts. If the question is completely unrelated, politely redirect the conversation back to Virtual Labs topics."

    // Generate content directly with the enhanced prompt
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
