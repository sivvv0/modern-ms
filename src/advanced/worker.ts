export class TimeWorkerPool {
  private workers: Worker[] = [];
  private taskQueue: Array<{
    input: any;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private activeWorkers = 0;
  
  constructor(public poolSize = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4) {
    this.initializeWorkers();
  }
  
  private initializeWorkers() {
    const workerCode = `
      self.addEventListener('message', async (e) => {
        const { type, input, options } = e.data;
        try {
          const ms = await import(self.location.origin + '/modern-ms/core.js');
          const result = type === 'parse' 
            ? ms.parse(input, options)
            : ms.format(input, options);
          self.postMessage({ success: true, result });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      });
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(workerUrl);
      worker.addEventListener('message', (e) => this.handleWorkerMessage(worker, e));
      this.workers.push(worker);
    }
  }
  
  private handleWorkerMessage(worker: Worker, event: MessageEvent) {
    const task = this.taskQueue.shift();
    if (task) {
      if (event.data.success) {
        task.resolve(event.data.result);
      } else {
        task.reject(new Error(event.data.error));
      }
    }
    this.activeWorkers--;
    this.processQueue();
  }
  
  private processQueue() {
    if (this.taskQueue.length === 0 || this.activeWorkers >= this.poolSize) return;
    
    const worker = this.workers.find(() => true);
    if (!worker) return;
    
    const task = this.taskQueue[0];
    this.activeWorkers++;
    worker.postMessage(task);
  }
  
  async parse(input: string, options?: any): Promise<number> {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ input, resolve, reject });
      this.processQueue();
    });
  }
  
  async format(ms: number, options?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ input: ms, resolve, reject });
      this.processQueue();
    });
  }
  
  destroy() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.taskQueue = [];
  }
}
