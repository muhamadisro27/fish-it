import fs from "fs"
import path from "path"

interface ProcessedEvent {
  user: string
  timestamp: number
  baitType: number
  amount: string
  blockNumber: number
  transactionHash: string
  processedAt: number
}

export class EventTracker {
  private processedEvents: Set<string> = new Set()
  private eventHistory: ProcessedEvent[] = []
  private storageFile: string

  constructor() {
    this.storageFile = path.join(process.cwd(), "processed_events.json")
    this.loadFromDisk()
  }

  // Generate unique key for event
  private getEventKey(
    user: string,
    timestamp: number,
    transactionHash?: string
  ): string {
    if (transactionHash) {
      return `${transactionHash}-${user}`
    }
    return `${user}-${timestamp}`
  }

  // Check if event was already processed
  isProcessed(
    user: string,
    timestamp: number,
    transactionHash?: string
  ): boolean {
    const key = this.getEventKey(user, timestamp, transactionHash)
    return this.processedEvents.has(key)
  }

  // Mark event as processed
  markAsProcessed(event: {
    user: string
    timestamp: number
    baitType: number
    amount: string
    blockNumber?: number
    transactionHash?: string
  }): void {
    const key = this.getEventKey(event.user, event.timestamp, event.transactionHash)
    
    if (this.processedEvents.has(key)) {
      return // Already processed
    }

    this.processedEvents.add(key)
    
    const processedEvent: ProcessedEvent = {
      user: event.user.toLowerCase(),
      timestamp: event.timestamp,
      baitType: event.baitType,
      amount: event.amount,
      blockNumber: event.blockNumber || 0,
      transactionHash: event.transactionHash || "",
      processedAt: Date.now(),
    }

    this.eventHistory.push(processedEvent)

    // Keep only last 1000 events in memory
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000)
      this.rebuildSet()
    }

    // Save to disk periodically (every 10 events)
    if (this.eventHistory.length % 10 === 0) {
      this.saveToDisk()
    }
  }

  // Rebuild set from history
  private rebuildSet(): void {
    this.processedEvents.clear()
    for (const event of this.eventHistory) {
      const key = this.getEventKey(
        event.user,
        event.timestamp,
        event.transactionHash
      )
      this.processedEvents.add(key)
    }
  }

  // Save to disk
  private saveToDisk(): void {
    try {
      const data = JSON.stringify(this.eventHistory, null, 2)
      fs.writeFileSync(this.storageFile, data, "utf-8")
    } catch (error) {
      console.error("⚠️  Failed to save event tracker to disk:", error)
    }
  }

  // Load from disk
  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.storageFile)) {
        const data = fs.readFileSync(this.storageFile, "utf-8")
        this.eventHistory = JSON.parse(data)
        this.rebuildSet()
        console.log(
          `📋 Loaded ${this.eventHistory.length} processed events from disk`
        )
      }
    } catch (error) {
      console.error("⚠️  Failed to load event tracker from disk:", error)
      this.eventHistory = []
      this.processedEvents.clear()
    }
  }

  // Get statistics
  getStats(): {
    totalProcessed: number
    uniqueUsers: number
    oldestEvent?: number
    newestEvent?: number
  } {
    const uniqueUsers = new Set(this.eventHistory.map((e) => e.user)).size

    return {
      totalProcessed: this.eventHistory.length,
      uniqueUsers,
      oldestEvent: this.eventHistory[0]?.processedAt,
      newestEvent: this.eventHistory[this.eventHistory.length - 1]?.processedAt,
    }
  }

  // Cleanup old events (older than 7 days)
  cleanup(): void {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const before = this.eventHistory.length
    
    this.eventHistory = this.eventHistory.filter(
      (e) => e.processedAt > sevenDaysAgo
    )
    
    if (before !== this.eventHistory.length) {
      this.rebuildSet()
      this.saveToDisk()
      console.log(
        `🧹 Cleaned up ${before - this.eventHistory.length} old events`
      )
    }
  }
}

