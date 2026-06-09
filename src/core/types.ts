export type TimeUnit = 
  | 'nanoseconds' | 'ns'
  | 'microseconds' | 'μs' | 'us'
  | 'milliseconds' | 'ms'
  | 'seconds' | 's' | 'sec'
  | 'minutes' | 'm' | 'min'
  | 'hours' | 'h' | 'hr'
  | 'days' | 'd'
  | 'weeks' | 'w'
  | 'months' | 'mo'
  | 'years' | 'y'
  | 'decades' | 'dec'
  | 'centuries' | 'c';

export type TimePattern = 
  | `${number}${TimeUnit}`
  | `${number} ${TimeUnit}`
  | `${number}.${number}${TimeUnit}`
  | `${number}.${number} ${TimeUnit}`;

export interface FormatOptions {
  long?: boolean;
  compact?: boolean;
  maxUnits?: number;
  minUnit?: TimeUnit;
  separator?: string;
  locale?: string;
  digits?: number;
  round?: 'floor' | 'ceil' | 'round';
}

export interface ParseOptions {
  strict?: boolean;
  cache?: boolean;
  locale?: string;
  fuzzy?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
}

export interface LocaleData {
  [K in TimeUnit]: {
    short: string;
    long: string;
    plural: (n: number) => string;
  };
}
