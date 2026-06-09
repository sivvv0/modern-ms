import { UNIT_TO_NANOSECONDS } from './constants';
import { globalCache } from './cache';
import type { TimeUnit, ParseOptions } from './types';

const TIME_PATTERN = new RegExp(
  `^([+-]?\\d+(?:\\.\\d+)?)\\s*(${Object.keys(UNIT_TO_NANOSECONDS).join('|')})$`,
  'i'
);

const COMPLEX_PATTERN = new RegExp(
  `(\\d+(?:\\.\\d+)?)\\s*(${Object.keys(UNIT_TO_NANOSECONDS).join('|')})`,
  'gi'
);

const NATURAL_PATTERNS: Record<string, number> = {
  half: 0.5,
  quarter: 0.25,
  dozen: 12,
  score: 20,
  couple: 2,
  few: 3,
  several: 5
};

export function parse(input: string | number | bigint, options: ParseOptions = {}): number {
  const cacheKey = `${input}_${options.strict}_${options.locale}`;
  if (options.cache !== false) {
    const cached = globalCache.get(cacheKey);
    if (cached !== undefined) return cached;
  }

  let result: number;

  if (typeof input === 'bigint') {
    result = Number(input / 1_000_000n);
  } else if (typeof input === 'number') {
    result = input;
  } else if (typeof input === 'string') {
    result = parseString(input, options);
  } else {
    throw new TypeError(`Unsupported input type: ${typeof input}`);
  }

  if (options.cache !== false) {
    globalCache.set(cacheKey, result);
  }

  return result;
}

function parseString(input: string, options: ParseOptions): number {
  const trimmed = input.trim().toLowerCase();
  
  if (!trimmed) throw new Error('Empty string');
  
  if (/^[+-]?\d+(?:\.\d+)?$/.test(trimmed)) {
    return parseFloat(trimmed);
  }
  
  if (options.fuzzy) {
    for (const [word, multiplier] of Object.entries(NATURAL_PATTERNS)) {
      if (trimmed.includes(word)) {
        const numericMatch = trimmed.match(/\d+(?:\.\d+)?/);
        const base = numericMatch ? parseFloat(numericMatch[0]) : 1;
        return parseFloat((base * multiplier).toString());
      }
    }
  }
  
  let totalNanoseconds = 0n;
  let match;
  
  while ((match = COMPLEX_PATTERN.exec(trimmed)) !== null) {
    const [, valueStr, unit] = match;
    const value = parseFloat(valueStr);
    const unitKey = unit.toLowerCase() as TimeUnit;
    const nsPerUnit = UNIT_TO_NANOSECONDS[unitKey];
    
    if (nsPerUnit) {
      totalNanoseconds += BigInt(Math.floor(value * Number(nsPerUnit)));
    }
  }
  
  if (totalNanoseconds !== 0n) {
    return Number(totalNanoseconds / 1_000_000n);
  }
  
  const simpleMatch = TIME_PATTERN.exec(trimmed);
  if (simpleMatch) {
    const [, valueStr, unit] = simpleMatch;
    const value = parseFloat(valueStr);
    const unitKey = unit.toLowerCase() as TimeUnit;
    const nsPerUnit = UNIT_TO_NANOSECONDS[unitKey];
    
    if (nsPerUnit) {
      return Number((BigInt(Math.floor(value * Number(nsPerUnit)))) / 1_000_000n);
    }
  }
  
  throw new Error(`Unable to parse time string: ${input}`);
}

export function parseBigInt(input: string | number): bigint {
  if (typeof input === 'bigint') return input;
  const ms = parse(input);
  return BigInt(ms) * 1_000_000n;
}
