import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// System prompt to provide context about Virtual Labs
const SYSTEM_PROMPT = `You are a helpful AI assistant for Virtual Labs, an educational platform that offers interactive virtual laboratory experiences in Physics, Chemistry, Mathematics, Computer Science, and Biology. 
      
Your name is "Virtual Labs Assistant". You should be knowledgeable about the labs offered on the platform, how to use them, and general information about the scientific concepts they cover.

Always be helpful, concise, and educational in your responses. If you don't know something, admit it and suggest where the user might find more information.

The Virtual Labs platform includes:
- Interactive simulations for various scientific concepts
- Virtual experiments that students can conduct safely online
- Educational content about Physics, Chemistry, Mathematics, Computer Science, and Biology
- A student dashboard to track progress and performance

Respond in a friendly, educational tone appropriate for students and educators.`

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

    // Prepare conversation for Gemini
    // First, add the system prompt to the user's first message
    let prompt = ""

    if (messages.length === 1) {
      // If this is the first message, combine system prompt with user query
      prompt = `${SYSTEM_PROMPT}\n\nUser query: ${lastMessage.content}`
    } else {
      // For subsequent messages, just use the user's message
      prompt = lastMessage.content
    }

    // For history, we need to format previous messages (excluding the last one)
    // and ensure they alternate between user and model
    const history = []

    // Only add history if there are previous messages
    if (messages.length > 1) {
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i]
        history.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })
      }
    }

    // Generate content directly without using chat history for now
    // This is a simpler approach that avoids the error
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
