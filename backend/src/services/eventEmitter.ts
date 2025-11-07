import { Response } from 'express';

export interface NFTProgress {
  user: string;
  stage: 'generating' | 'uploading_image' | 'uploading_metadata' | 'minting' | 'complete' | 'error';
  message: string;
  data?: any;
}

export class SSEManager {
  private clients = new Map<string, Response[]>();

  addClient(user: string, res: Response) {
    if (!this.clients.has(user)) {
      this.clients.set(user, []);
    }
    this.clients.get(user)!.push(res);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    // Send initial connection message
    this.sendToClient(res, {
      user,
      stage: 'generating',
      message: 'Connected to NFT generator'
    });

    // Cleanup on disconnect
    res.on('close', () => {
      this.removeClient(user, res);
    });
  }

  removeClient(user: string, res: Response) {
    const clients = this.clients.get(user);
    if (clients) {
      const index = clients.indexOf(res);
      if (index > -1) {
        clients.splice(index, 1);
      }
      if (clients.length === 0) {
        this.clients.delete(user);
      }
    }
  }

  sendProgress(progress: NFTProgress) {
    const clients = this.clients.get(progress.user);
    if (clients) {
      clients.forEach(client => this.sendToClient(client, progress));
    }
  }

  private sendToClient(res: Response, data: NFTProgress) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export const sseManager = new SSEManager();