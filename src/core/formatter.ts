import { UNIT_TO_NANOSECONDS, UNITS_ORDER } from './constants';
import type { FormatOptions, TimeUnit } from './types';

export function format(ms: number | bigint, options: FormatOptions = {}): string {
  const nanoseconds = typeof ms === 'bigint' 
    ? ms 
    : BigInt(Math.abs(ms)) * 1_000_000n;
  
  const sign = (typeof ms === 'number' && ms < 0) || (typeof ms === 'bigint' && ms < 0n) ? '-' : '';
  let remaining = nanoseconds < 0n ? -nanoseconds : nanoseconds;
  
  const parts: string[] = [];
  const {
    long = false,
    compact = false,
    maxUnits = 2,
    minUnit = 'nanoseconds',
    separator = long ? ' ' : '',
    digits = 1,
    round = 'round'
  } = options;
  
  for (const unit of UNITS_ORDER) {
    if (parts.length >= maxUnits) break;
    if (shouldSkipUnit(unit, minUnit)) continue;
    
    const unitNs = UNIT_TO_NANOSECONDS[unit];
    if (!unitNs || remaining < unitNs) continue;
    
    let value = Number(remaining / unitNs);
    remaining %= unitNs;
    
    if (round !== 'floor' && remaining > 0n && parts.length === maxUnits - 1) {
      const nextUnit = UNITS_ORDER[UNITS_ORDER.indexOf(unit) + 1];
      if (nextUnit) {
        const nextUnitNs = UNIT_TO_NANOSECONDS[nextUnit];
        const remainderInNextUnit = Number(remaining / nextUnitNs);
        if (remainderInNextUnit >= 0.5) {
          value += 1;
          remaining = 0n;
        }
      }
    }
    
    let finalValue = value;
    if (round === 'floor') finalValue = Math.floor(value);
    else if (round === 'ceil') finalValue = Math.ceil(value);
    else if (round === 'round') finalValue = Math.round(value);
    
    if (finalValue === 0) continue;
    
    const unitName = getUnitName(unit, finalValue, long, compact);
    const formattedValue = formatNumber(finalValue, digits, compact);
    
    parts.push(compact ? `${formattedValue}${unitName}` : `${formattedValue}${separator}${unitName}`);
  }
  
  if (parts.length === 0) {
    const zeroUnit = getUnitName('milliseconds', 0, long, compact);
    return `${sign}0${compact ? zeroUnit : separator + zeroUnit}`;
  }
  
  return sign + (compact ? parts.join('') : parts.join(separator));
}

function shouldSkipUnit(unit: TimeUnit, minUnit: TimeUnit): boolean {
  const unitIndex = UNITS_ORDER.indexOf(unit);
  const minIndex = UNITS_ORDER.indexOf(minUnit);
  return unitIndex > minIndex;
}

function getUnitName(unit: TimeUnit, value: number, long: boolean, compact: boolean): string {
  if (compact) {
    const compactMap: Record<TimeUnit, string> = {
      centuries: 'c', decades: 'dec', years: 'y', months: 'mo', weeks: 'w',
      days: 'd', hours: 'h', minutes: 'm', seconds: 's', milliseconds: 'ms',
      microseconds: 'μs', nanoseconds: 'ns'
    };
    return compactMap[unit];
  }
  
  if (!long) {
    const shortMap: Record<TimeUnit, string> = {
      centuries: 'c', decades: 'dec', years: 'yr', months: 'mo', weeks: 'wk',
      days: 'd', hours: 'hr', minutes: 'min', seconds: 'sec', milliseconds: 'ms',
      microseconds: 'μs', nanoseconds: 'ns'
    };
    return shortMap[unit];
  }
  
  const longNames: Record<TimeUnit, string> = {
    centuries: 'century', decades: 'decade', years: 'year', months: 'month',
    weeks: 'week', days: 'day', hours: 'hour', minutes: 'minute',
    seconds: 'second', milliseconds: 'millisecond', microseconds: 'microsecond',
    nanoseconds: 'nanosecond'
  };
  
  const base = longNames[unit];
  return value === 1 ? base : `${base}s`;
}

function formatNumber(value: number, digits: number, compact: boolean): string {
  if (compact && value >= 1000) {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(digits) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(digits) + 'k';
  }
  
  return digits === 0 ? Math.round(value).toString() : value.toFixed(digits);
}
