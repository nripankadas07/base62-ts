import { Base62Error } from './errors';

export const ALPHABET: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function buildCharTable(alphabet: string): Map<string, number> {
  if (typeof alphabet !== 'string') throw new Base62Error('alphabet must be a string');
  const chars = [...alphabet];
  if (chars.length < 2) throw new Base62Error('alphabet must contain at least 2 characters');
  for (const c of chars) {
    if (c.length !== 1) throw new Base62Error('alphabet must only contain characters from the BMP (no surrogate pairs)');
  }
  const table = new Map<string, number>();
  for (let i = 0; i < chars.length; i += 1) {
    const c = chars[i];
    if (table.has(c)) throw new Base62Error(`alphabet contains duplicate character ${JSON.stringify(c)}`);
    table.set(c, i);
  }
  return table;
}
