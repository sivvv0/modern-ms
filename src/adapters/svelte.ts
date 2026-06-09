import { writable, readable, derived, type Writable } from 'svelte/store';
import { parse, format } from '../core/index.js';

export function createMsStore(value: string | number, options?: any) {
  const store = writable(typeof value === 'string' ? parse(value, options) : format(value, options));
  
  return {
    subscribe: store.subscribe,
    set: (newValue: string | number) => {
      const result = typeof newValue === 'string' ? parse(newValue, options) : format(newValue, options);
      store.set(result);
    }
  };
}

export function createLiveTimeStore(formatOptions?: any) {
  const { subscribe, set } = writable(format(Date.now(), formatOptions));
  
  let interval: ReturnType<typeof setInterval>;
  
  return {
    subscribe,
    start: () => {
      interval = setInterval(() => {
        set(format(Date.now(), formatOptions));
      }, 1000);
    },
    stop: () => {
      if (interval) clearInterval(interval);
    }
  };
}
