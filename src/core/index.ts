import { parse } from './parser';
import { format } from './formatter';
import type { FormatOptions, ParseOptions, TimeUnit } from './types';

function ms(value: string | number, options?: FormatOptions | ParseOptions): string | number {
  if (typeof value === 'string') return parse(value, options as ParseOptions);
  return format(value, options as FormatOptions);
}

ms.parse = parse;
ms.format = format;

export default ms;
export { parse, format, type FormatOptions, type ParseOptions, type TimeUnit };
