import { parse } from './parser';
import { format } from './formatter';
import type { FormatOptions, ParseOptions, TimeUnit } from './types';

function ms(value: string | number, options?: FormatOptions | ParseOptions): string | number {
  if (typeof value === 'string') return parse(value, options as ParseOptions);
  return format(value, options as FormatOptions);
}

ms.parse = parse;
ms.format = format;

// Use named exports only to avoid warning
export { ms as default, parse, format };
export type { FormatOptions, ParseOptions, TimeUnit };
