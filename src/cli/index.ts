#!/usr/bin/env node

import { parse, format } from '../core/index.js';

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(`
modern-ms CLI - Time conversion utility

Usage:
  modern-ms parse <time-string>     Parse time to milliseconds
  modern-ms format <milliseconds>   Format milliseconds to string
  modern-ms --help                  Show this help

Examples:
  modern-ms parse "2 days"          → 172800000
  modern-ms parse "1.5h"            → 5400000
  modern-ms format 60000            → 1m
  modern-ms format 1337000 --long   → 22 minutes 17 seconds
  `);
  process.exit(0);
}

if (command === 'parse') {
  const timeStr = args[1];
  if (!timeStr) {
    console.error('Error: Please provide a time string to parse');
    process.exit(1);
  }
  
  try {
    const result = parse(timeStr);
    console.log(`\n✓ ${timeStr} = ${result.toLocaleString()} milliseconds\n`);
  } catch (error: any) {
    console.error(`\n✗ Error: ${error.message}\n`);
    process.exit(1);
  }
}

if (command === 'format') {
  const ms = args[1];
  if (!ms) {
    console.error('Error: Please provide milliseconds to format');
    process.exit(1);
  }
  
  const long = args.includes('--long');
  
  try {
    const result = format(parseFloat(ms), { long });
    console.log(`\n→ ${ms}ms = ${result}\n`);
  } catch (error: any) {
    console.error(`\n✗ Error: ${error.message}\n`);
    process.exit(1);
  }
}
