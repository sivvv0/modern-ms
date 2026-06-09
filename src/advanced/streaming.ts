import { Transform, type TransformCallback } from 'stream';
import { parse, format } from '../core/index.js';

export class TimeTransformStream extends Transform {
  private mode: 'parse' | 'format';
  private options: any;
  
  constructor(mode: 'parse' | 'format' = 'parse', options = {}) {
    super({ objectMode: true });
    this.mode = mode;
    this.options = options;
  }
  
  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    try {
      const result = this.mode === 'parse' 
        ? parse(chunk.toString(), this.options)
        : format(chunk, this.options);
      callback(null, result);
    } catch (err) {
      callback(err as Error);
    }
  }
}

export function createTimePipeline() {
  return {
    parse: () => new TimeTransformStream('parse'),
    format: () => new TimeTransformStream('format'),
    
    async processFile(inputPath: string, outputPath: string, mode: 'parse' | 'format') {
      const { createReadStream, createWriteStream } = await import('fs');
      const readStream = createReadStream(inputPath, { encoding: 'utf8' });
      const writeStream = createWriteStream(outputPath);
      const transform = new TimeTransformStream(mode);
      
      return new Promise((resolve, reject) => {
        readStream
          .pipe(transform)
          .pipe(writeStream)
          .on('finish', resolve)
          .on('error', reject);
      });
    }
  };
}
