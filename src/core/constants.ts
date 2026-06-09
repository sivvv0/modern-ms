import type { TimeUnit } from './types';

export const UNIT_TO_NANOSECONDS: Record<TimeUnit, bigint> = {
  nanoseconds: 1n,
  ns: 1n,
  microseconds: 1000n,
  μs: 1000n,
  us: 1000n,
  milliseconds: 1_000_000n,
  ms: 1_000_000n,
  seconds: 1_000_000_000n,
  s: 1_000_000_000n,
  sec: 1_000_000_000n,
  minutes: 60_000_000_000n,
  m: 60_000_000_000n,
  min: 60_000_000_000n,
  hours: 3_600_000_000_000n,
  h: 3_600_000_000_000n,
  hr: 3_600_000_000_000n,
  days: 86_400_000_000_000n,
  d: 86_400_000_000_000n,
  weeks: 604_800_000_000_000n,
  w: 604_800_000_000_000n,
  months: 2_592_000_000_000_000n,
  mo: 2_592_000_000_000_000n,
  years: 31_557_600_000_000_000n,
  y: 31_557_600_000_000_000n,
  decades: 315_576_000_000_000_000n,
  dec: 315_576_000_000_000_000n,
  centuries: 3_155_760_000_000_000_000n,
  c: 3_155_760_000_000_000_000n
};

export const NANOSECONDS_TO_UNIT = Object.fromEntries(
  Object.entries(UNIT_TO_NANOSECONDS).map(([unit, ns]) => [unit, Number(1_000_000_000n / ns)])
);

export const ASTRONOMICAL_UNITS = {
  lunarMonth: 2_551_442_976_000_000n,
  julianYear: 31_557_600_000_000_000n,
  gregorianYear: 31_556_952_000_000_000n,
  siderealYear: 31_558_149_763_200_000n
};

export const CACHE_CONFIG = {
  maxSize: 10_000,
  ttl: 3600000,
  cleanupInterval: 300000
};

export const UNITS_ORDER: TimeUnit[] = [
  'centuries', 'decades', 'years', 'months', 'weeks', 
  'days', 'hours', 'minutes', 'seconds', 'milliseconds', 
  'microseconds', 'nanoseconds'
];
