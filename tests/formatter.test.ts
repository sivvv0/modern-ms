import { describe, it, expect } from 'vitest';
import { format } from '../src/core/formatter';

describe('formatter', () => {
  it('should format basic units', () => {
    expect(format(1000)).toBe('1s');
    expect(format(60000)).toBe('1m');
    expect(format(3600000)).toBe('1h');
    expect(format(86400000)).toBe('1d');
  });
  
  it('should format with long option', () => {
    expect(format(60000, { long: true })).toBe('1 minute');
    expect(format(120000, { long: true })).toBe('2 minutes');
  });
  
  it('should format with max units', () => {
    expect(format(93784000, { maxUnits: 2 })).toBe('1d 2h');
    expect(format(93784000, { maxUnits: 3 })).toBe('1d 2h 3m');
  });
  
  it('should format compact numbers', () => {
    expect(format(1500000, { compact: true })).toBe('1.5M');
    expect(format(2500000, { compact: true })).toBe('2.5M');
  });
});
