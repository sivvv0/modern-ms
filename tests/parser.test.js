import { describe, it, expect } from 'vitest';
import { parse } from '../src/core/parser';

describe('parser', () => {
  it('should parse basic units', () => {
    expect(parse('1s')).toBe(1000);
    expect(parse('1m')).toBe(60000);
    expect(parse('1h')).toBe(3600000);
    expect(parse('1d')).toBe(86400000);
    expect(parse('1w')).toBe(604800000);
  });
  
  it('should parse decimal values', () => {
    expect(parse('1.5h')).toBe(5400000);
    expect(parse('0.5d')).toBe(43200000);
  });
  
  it('should parse complex expressions', () => {
    expect(parse('1h 30m')).toBe(5400000);
    expect(parse('2d 5h 30m')).toBe(199800000);
  });
  
  it('should handle negative values', () => {
    expect(parse('-1h')).toBe(-3600000);
    expect(parse('-2d')).toBe(-172800000);
  });
  
  it('should handle pure numbers', () => {
    expect(parse('500')).toBe(500);
    expect(parse('1000')).toBe(1000);
  });
  
  it('should throw on invalid input', () => {
    expect(() => parse('invalid')).toThrow();
    expect(() => parse('')).toThrow();
  });
});
