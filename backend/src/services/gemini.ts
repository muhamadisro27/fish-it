import { GoogleGenerativeAI } from '@google/generative-ai';
import { NFTMetadata } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateNFTMetadata(
  rarity: string,
  baitUsed: string,
  stakeAmount: string
): Promise<Omit<NFTMetadata, 'image' | 'external_url'>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response');
  
  return JSON.parse(jsonMatch[0]);
}
