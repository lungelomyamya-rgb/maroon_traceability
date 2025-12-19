// src/lib/storage.ts
interface FileMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

interface QueuedFile {
  id: string;
  file: File;
  path: string;
  metadata?: FileMetadata;
  status: 'queued' | 'uploading' | 'completed' | 'failed';
  error?: string;
  timestamp: number;
}

class StorageService {
  private queue: QueuedFile[] = [];
  private isOnline = typeof window !== 'undefined' ? navigator.onLine : true;
  private isProcessing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.processQueue());
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  async uploadFile(file: File, path: string, metadata?: FileMetadata): Promise<string> {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const queuedFile: QueuedFile = {
      id: fileId,
      file,
      path,
      metadata,
      status: 'queued',
      timestamp: Date.now(),
    };

    this.queue.push(queuedFile);
    await this.processQueue();
    return fileId;
  }

  private async processQueue() {
    if (this.isProcessing || !this.isOnline) return;
    this.isProcessing = true;

    while (this.queue.length > 0 && this.isOnline) {
      const file = this.queue[0];
      if (file.status === 'completed') {
        this.queue.shift();
        continue;
      }

      try {
        file.status = 'uploading';
        // Replace with your actual upload logic
        // const downloadURL = await yourUploadFunction(file.file, file.path, file.metadata);
        file.status = 'completed';
        this.queue.shift();
        
        // Emit event or update state
        this.emitUpdate();
      } catch (error) {
        console.error('Upload failed:', error);
        file.status = 'failed';
        file.error = error instanceof Error ? error.message : 'Upload failed';
        this.isProcessing = false;
        return;
      }
    }

    this.isProcessing = false;
  }

  private emitUpdate() {
    if (typeof window === 'undefined') return;
    
    // Emit event or update state as needed
    const event = new CustomEvent('storage:queue-update', { 
      detail: { queue: [...this.queue] } 
    });
    window.dispatchEvent(event);
  }

  getQueue(): QueuedFile[] {
    return [...this.queue];
  }
}

export const storageService = typeof window !== 'undefined' ? new StorageService() : null;