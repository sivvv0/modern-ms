import { CACHE_CONFIG } from './constants';
import type { CacheStats } from './types';

class LRUCache<K, V> {
  private cache = new Map<K, { value: V; expires: number }>();
  private maxSize: number;
  private ttl: number;
  public stats: CacheStats = { hits: 0, misses: 0, size: 0, maxSize: 0 };

  constructor(maxSize = CACHE_CONFIG.maxSize, ttl = CACHE_CONFIG.ttl) {
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.stats.maxSize = maxSize;
    this.startCleanup();
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      expires: Date.now() + this.ttl
    });
    this.stats.size = this.cache.size;
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return undefined;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      return undefined;
    }
    
    this.stats.hits++;
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  private startCleanup(): void {
    if (typeof setInterval === 'undefined') return;
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expires) this.cache.delete(key);
      }
      this.stats.size = this.cache.size;
    }, CACHE_CONFIG.cleanupInterval);
  }

  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, size: 0, maxSize: this.maxSize };
  }
}

export const globalCache = new LRUCache<string, number>();
