import { BaitType } from '../types';

export function calculateRarity(baitType: BaitType, stakeAmount: bigint): string {
  const baitMul = {
    [BaitType.Common]: 1.0,
    [BaitType.Rare]: 1.1,
    [BaitType.Epic]: 1.25,
    [BaitType.Legendary]: 1.5,
  }[baitType];

  const r0 = Math.floor(Math.random() * 10000);
  const base = r0 / 10000;
  
  const stakeNum = Number(stakeAmount) / 1e18;
  const mStake = 1 + 0.35 * Math.log10(Math.max(stakeNum, 100) / 100);
  
  const score = Math.min(1, base * baitMul * mStake);

  if (score >= 0.9) return 'legendary';
  if (score >= 0.7) return 'epic';
  if (score >= 0.4) return 'rare';
  return 'common';
}

export function getBaitName(baitType: BaitType): string {
  return ['Common', 'Rare', 'Epic', 'Legendary'][baitType];
}
