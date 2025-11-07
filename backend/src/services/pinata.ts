import pinataSDK from "@pinata/sdk"
import { NFTMetadata } from "../types"
import { Readable } from "stream";

let pinata: any

function getPinata() {
  if (!pinata) {
    const apiKey = process.env.PINATA_API_KEY
    const secretKey = process.env.PINATA_SECRET_KEY

    if (!apiKey || !secretKey) {
      throw new Error(
        "PINATA_API_KEY and PINATA_SECRET_KEY must be set in .env file"
      )
    }

    pinata = new pinataSDK(apiKey, secretKey)
  }
  return pinata
}

export async function testConnection(): Promise<boolean> {
  try {
    await getPinata().testAuthentication()
    return true
  } catch (error: any) {
    console.error("Pinata auth error:", error.message)
    return false
  }
}

export async function uploadImageToPinata(
  imageBuffer: Buffer,
  fileName: string
): Promise<string> {
  try {
    console.log('📤 Uploading image to Pinata:', fileName);
    
    // Convert Buffer to Readable Stream (required by Pinata SDK)
    const stream = Readable.from(imageBuffer);
    
    const result = await getPinata().pinFileToIPFS(stream, {
      pinataMetadata: {
        name: fileName.replace('.png', ''), // Remove extension
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    console.log('✅ Image uploaded:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error: any) {
    console.error('❌ Failed to upload image:', error.message);
    throw new Error(`Image upload failed: ${error.message}`);
  }
}


export async function uploadMetadataToPinata(metadata: NFTMetadata): Promise<string> {
  const result = await getPinata().pinJSONToIPFS(metadata, {
    pinataMetadata: { name: metadata.name },
  });
  return result.IpfsHash;
}