import { NFTMetadata } from "../types"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config()

interface PollinationsOptions {
  width?: number
  height?: number
  model?: "flux" | "flux-realism" | "flux-anime" | "flux-3d" | "turbo"
  seed?: number
  nologo?: boolean
  enhance?: boolean
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// export async function generateFishImage(
//   fishName: string,
//   species: string,
//   rarity: string
// ): Promise<string> {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" })

//   const prompt = `Generate a high-quality, detailed illustration of a ${species} fish named "${fishName}".
// Style: Fantasy game art, vibrant colors, professional NFT quality
// Rarity: ${rarity}
// Background: Ocean/underwater themed with ${rarity} visual effects
// Make it look majestic and unique for an NFT collectible.`

//   const result = await model.generateContent([prompt])
//   const response = await result.response

//   console.log("response", response.candidates?.[0]?.content?.parts)

//   const imagePart = response.candidates?.[0]?.content?.parts?.find(
//     (part: any) => part.inlineData
//   )

//   if (!imagePart?.inlineData?.data) {
//     throw new Error("Failed to generate image: No inline data found")
//   }

//   return ""
// return Buffer.from(imagePart.inlineData.data, "base64")
// }

export async function generateFishImage(
  fishName: string,
  species: string,
  rarity: string,
  options: PollinationsOptions = {}
): Promise<string> {
  try {
    // Default options
    const defaultOptions: PollinationsOptions = {
      width: 1024,
      height: 1024,
      model: "flux-realism", // Model terbaik untuk foto realistis
      nologo: true,
      enhance: true,
      ...options,
    }

    // Buat prompt yang detail
    const prompt = createFishPrompt(fishName, species, rarity)

    // Encode prompt untuk URL
    const encodedPrompt = encodeURIComponent(prompt)

    // Build URL dengan parameters
    const params = new URLSearchParams({
      width: defaultOptions.width!.toString(),
      height: defaultOptions.height!.toString(),
      model: defaultOptions.model!,
      nologo: defaultOptions.nologo ? "true" : "false",
      enhance: defaultOptions.enhance ? "true" : "false",
      ...(defaultOptions.seed && { seed: defaultOptions.seed.toString() }),
    })

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`

    console.log("🔗 URL:", imageUrl)

    return imageUrl
  } catch (error: any) {
    console.error("❌ Error generating fish image:", error)
    throw new Error(`Failed to generate image: ${error.message}`)
  }
}

function createFishPrompt(
  fishName: string,
  species: string,
  rarity: string
): string {
  return `Generate a high-quality, detailed illustration of a ${species} fish named "${fishName}".
Style: Fantasy game art, vibrant colors, professional NFT quality
Rarity: ${rarity}
Background: Ocean/underwater themed with ${rarity} visual effects
Make it look majestic and unique for an NFT collectible.`
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

  const prompt = `Generate a high-quality, detailed illustration of a ${species} fish named "${fishName}".
Style: Fantasy game art, vibrant colors, professional NFT quality
Rarity: ${rarity}
Background: Ocean/underwater themed with ${rarity} visual effects
Make it look majestic and unique for an NFT collectible.`

  try {
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
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 2048,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    type OpenRouterResponse = {
      choices?: {
        message?: {
          content?:
            | string
            | { type: string; text?: string; image_url?: string }[]
        }
      }[]
    }

    const data = (await response.json()) as OpenRouterResponse

    let imageUrl: string | undefined

    const content = data.choices?.[0]?.message?.content

    if (typeof content === "string") {
      // jika berupa string, cari URL di dalam teks
      const match = content.match(/https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp)/i)
      imageUrl = match ? match[0] : undefined
    } else if (Array.isArray(content)) {
      // jika berupa array (structured content)
      const imagePart = content.find(
        (c) => c.type === "image_url" && c.image_url
      )
      imageUrl = imagePart?.image_url
    }

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
