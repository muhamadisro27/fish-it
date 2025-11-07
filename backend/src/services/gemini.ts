import { NFTMetadata } from "../types"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface ImageGenerationResponse {
  success: boolean
  imageUrl: string
  metadata: {
    model: string
    generatedAt: number
  }
}

export async function generateFishImage(
  fishName: string,
  species: string,
  rarity: string
): Promise<Buffer> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `Generate a high-quality, detailed illustration of a ${species} fish named "${fishName}".
Style: Fantasy game art, vibrant colors, professional NFT quality
Rarity: ${rarity}
Background: Ocean/underwater themed with ${rarity} visual effects
Make it look majestic and unique for an NFT collectible.`

  const result = await model.generateContent([prompt])
  const response = await result.response

  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part: any) => part.inlineData
  )

  if (!imagePart?.inlineData?.data) {
    throw new Error("Failed to generate image: No inline data found")
  }

  return Buffer.from(imagePart.inlineData.data, "base64")
}

export async function generateFishImageWithModel(
  fishName: string,
  species: string,
  rarity: string,
  model: string = "google/gemini-2.5-flash-image"
): Promise<string> {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY

  if (!openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables")
  }

  try {
    const prompt = `Generate a high-quality, detailed illustration of a ${species} fish named "${fishName}".
Style: Fantasy game art, vibrant colors, professional NFT quality
Rarity: ${rarity}
Background: Ocean/underwater themed with ${rarity} visual effects
Make it look majestic and unique for an NFT collectible.`

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "Fish NFT Generator",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 2048,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // let imageUrl = ""
    // if (typeof content === "string" && content.startsWith("http")) {
    //   imageUrl = content
    // } else if (typeof content === "string") {
    //   const urlMatch = content.match(
    //     /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i
    //   )
    //   imageUrl = urlMatch ? urlMatch[1] : ""
    // }

    const imageUrl = data.choices?.[0]?.message.images[0].image_url.url

    if (!imageUrl) {
      throw new Error("No image URL found in response")
    }

    return imageUrl
  } catch (error) {
    console.error("Error generating fish image:", error)
    throw error
  }
}

export async function generateNFTMetadata(
  rarity: string,
  baitUsed: string,
  stakeAmount: string
): Promise<Omit<NFTMetadata, "image" | "external_url">> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `Generate a unique fish NFT metadata in JSON format.
Rarity: ${rarity}
Bait Used: ${baitUsed}
Stake Amount: ${stakeAmount} FSHT

Return ONLY valid JSON with this structure:
{
  "name": "unique fish name",
  "description": "creative description",
  "species": "fish species",
  "attributes": [
    {"trait_type": "Rarity", "value": "${rarity}"},
    {"trait_type": "Species", "value": "species name"},
    {"trait_type": "Weight", "value": weight in kg},
    {"trait_type": "Bait Used", "value": "${baitUsed}"},
    {"trait_type": "Stake Amount", "value": "${stakeAmount}"}
  ]
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("Invalid AI response")

  return JSON.parse(jsonMatch[0])
}
