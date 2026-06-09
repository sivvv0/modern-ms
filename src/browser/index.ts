import { parse, format } from '../core/index.js';

const modernMs = {
  parse,
  format,
  version: '2.0.0'
};

export default modernMs;
export { parse, format };

if (typeof window !== 'undefined') {
  (window as any).modernMs = modernMs;
}
