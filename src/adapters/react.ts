import { use, useMemo, useSyncExternalStore, useTransition, useState, useEffect, createContext, useContext } from 'react';
import { parse, format } from '../core/index.js';

let currentTime = Date.now();
const listeners = new Set<() => void>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    currentTime = Date.now();
    listeners.forEach(listener => listener());
  }, 1000);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentTime;
}

export function useLiveTime(formatOptions?: any) {
  const timestamp = useSyncExternalStore(subscribe, getSnapshot);
  return format(timestamp, formatOptions);
}

export function useMs(value: string | number | Promise<string | number>, options?: any) {
  const resolvedValue = value instanceof Promise ? use(value) : value;
  return useMemo(() => {
    if (typeof resolvedValue === 'string') return parse(resolvedValue, options);
    return format(resolvedValue, options);
  }, [resolvedValue, options]);
}

export function useAsyncMs(value: string | number, options?: any) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(() => 
    typeof value === 'string' ? parse(value, options) : format(value, options)
  );
  
  useEffect(() => {
    startTransition(() => {
      const newResult = typeof value === 'string' 
        ? parse(value, options) 
        : format(value, options);
      setResult(newResult);
    });
  }, [value, options]);
  
  return { result, isPending };
}

const MsContext = createContext<{ locale?: string; long?: boolean }>({});

export function MsProvider({ children, ...config }: any) {
  return <MsContext.Provider value={config}>{children}</MsContext.Provider>;
}

export function useMsConfig() {
  return useContext(MsContext);
}

export function useMsWithConfig(value: string | number) {
  const config = useMsConfig();
  return useMemo(() => {
    if (typeof value === 'string') return parse(value, config);
    return format(value, config);
  }, [value, config]);
}

const msCache = new Map<string, Promise<number>>();

export function SuspenseMs({ value, options, children }: any) {
  let promise = msCache.get(value);
  
  if (!promise) {
    promise = Promise.resolve(parse(value, options));
    msCache.set(value, promise);
  }
  
  const result = use(promise);
  return children(result);
}
