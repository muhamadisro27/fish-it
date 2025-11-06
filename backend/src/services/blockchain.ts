import { ethers } from 'ethers';

const STAKING_ABI = [
  'event FishCaught(address indexed user, uint256 amount, uint8 baitType, uint256 timestamp)',
  'function prepareNFT(address user, string memory cid) external',
];

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private stakingContract: ethers.Contract;
  private lastBlock: number = 0;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
    this.stakingContract = new ethers.Contract(
      process.env.STAKING_CONTRACT!,
      STAKING_ABI,
      this.wallet
    );
  }

  async listenToFishCaught(callback: (event: any) => Promise<void>) {
    console.log('🎣 Listening for FishCaught events (polling every 5s)...');
    
    this.lastBlock = await this.provider.getBlockNumber();
    
    setInterval(async () => {
      try {
        const currentBlock = await this.provider.getBlockNumber();
        if (currentBlock > this.lastBlock) {
          const events = await this.stakingContract.queryFilter(
            'FishCaught',
            this.lastBlock + 1,
            currentBlock
          );
          
          for (const event of events) {
            const [user, amount, baitType, timestamp] = event.args!;
            console.log(`\n🐟 Fish Caught!`);
            console.log(`User: ${user}`);
            console.log(`Amount: ${ethers.formatEther(amount)} FSHT`);
            console.log(`Bait: ${baitType}`);
            
            await callback({ user, amount, baitType, timestamp, event });
          }
          
          this.lastBlock = currentBlock;
        }
      } catch (error: any) {
        console.error('⚠️  Polling error:', error.message);
      }
    }, 5000);
  }

  async prepareNFT(userAddress: string, cid: string): Promise<string> {
    console.log(`📝 Preparing NFT for ${userAddress}...`);
    const tx = await this.stakingContract.prepareNFT(userAddress, cid);
    console.log(`⏳ Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ NFT prepared!`);
    return tx.hash;
  }

  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }
}
