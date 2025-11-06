export enum BaitType {
  Common = 0,
  Rare = 1,
  Epic = 2,
  Legendary = 3,
}

export interface FishCaughtEvent {
  user: string;
  amount: bigint;
  baitType: BaitType;
  timestamp: bigint;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}
