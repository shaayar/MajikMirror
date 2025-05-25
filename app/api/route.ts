import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST() {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Generate a whimsical, magical compliment as if spoken by an enchanted mirror. The compliment should be:
      - Mystical and fairy-tale like in tone
      - Personalized and uplifting
      - 1-2 sentences long
      - Include magical imagery or metaphors
      - Make the person feel special and magical themselves
      
      Examples:
      "Your inner light shines brighter than a thousand starlit crystals, dear one."
      "The universe whispers of your kindness through every gentle breeze."
      
      Generate one unique magical compliment:`,
    })

    return Response.json({ compliment: text.trim() })
  } catch (error) {
    console.error("Error generating compliment:", error)
    return Response.json({ error: "Failed to generate compliment" }, { status: 500 })
  }
}
