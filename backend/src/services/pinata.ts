import pinataSDK from '@pinata/sdk';
import { NFTMetadata } from '../types';

let pinata: any;

function getPinata() {
  if (!pinata) {
    const apiKey = process.env.PINATA_API_KEY;
    const secretKey = process.env.PINATA_SECRET_KEY;
    
    if (!apiKey || !secretKey) {
      throw new Error('PINATA_API_KEY and PINATA_SECRET_KEY must be set in .env file');
    }
    
    pinata = new pinataSDK(apiKey, secretKey);
  }
  return pinata;
}

export async function uploadMetadataToPinata(metadata: NFTMetadata): Promise<string> {
  const result = await getPinata().pinJSONToIPFS(metadata, {
    pinataMetadata: { name: metadata.name },
  });
  return result.IpfsHash;
}

export async function testConnection(): Promise<boolean> {
  try {
    await getPinata().testAuthentication();
    return true;
  } catch (error: any) {
    console.error('Pinata auth error:', error.message);
    return false;
  }
}
