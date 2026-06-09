import { createSignal, createMemo, onCleanup } from 'solid-js';
import { parse, format } from '../core/index.js';

export function useMs(value: () => string | number, options?: any) {
  return createMemo(() => {
    const val = value();
    if (typeof val === 'string') return parse(val, options);
    return format(val, options);
  });
}

export function useLiveTime(formatOptions?: any) {
  const [time, setTime] = createSignal(Date.now());
  
  const interval = setInterval(() => {
    setTime(Date.now());
  }, 1000);
  
  onCleanup(() => clearInterval(interval));
  
  return createMemo(() => format(time(), formatOptions));
}
