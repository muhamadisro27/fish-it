import { NFTMetadata } from "../types"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

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