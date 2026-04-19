import { Base62Error } from './errors';

/**
 * Normalise any accepted numeric input (number | bigint) to a non-negative
 * bigint. Rejects negatives, NaN, Infinity, non-integer numbers, and
 * non-number/non-bigint types with descriptive Base62Error messages.
 */
export function toNonNegativeBigInt(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    if (value < 0n) {
      throw new Base62Error('value must be a non-negative integer');
    }
    return value;
  }
  if (typeof value !== 'number') {
    throw new Base62Error('value must be a number or bigint');
  }
  if (!Number.isFinite(value)) {
    throw new Base62Error('value must be a finite number');
  }
  if (!Number.isInteger(value)) {
    throw new Base62Error('value must be an integer');
  }
  if (value < 0) {
    throw new Base62Error('value must be a non-negative integer');
  }
  return BigInt(value);
}

/**
 * Encode a non-negative bigint as a Base62 string using the provided alphabet.
 * The base is derived from `alphabet.length`, so the same routine works for
 * Base62 and for custom-alphabet variants (Base58, Base36, …).
 *
 * Zero is encoded as the first character of the alphabet to preserve a
 * round-trip invariant for every non-negative integer.
 */
export function encodeInt(value: bigint, alphabet: string): string {
  const base = BigInt([...alphabet].length);
  if (value === 0n) {
    return alphabet[0];
  }
  const characters: string[] = [];
  let remaining = value;
  while (remaining > 0n) {
    const digit = Number(remaining % base);
    characters.push(alphabet[digit]);
    remaining = remaining / base;
  }
  return characters.reverse().join('');
}

/**
 * Decode a Base62 string back to a bigint. Every character must be part of
 * `alphabet`; an empty string, a non-string input, or an out-of-alphabet
 * character triggers a Base62Error with the offending position.
 */
export function decodeInt(
  text: string,
  alphabet: string,
  charTable: Map<string, number>,
): bigint {
  if (typeof text !== 'string') {
    throw new Base62Error('encoded value must be a string');
  }
  if (text.length === 0) {
    throw new Base62Error('encoded value must not be empty');
  }
  const base = BigInt([...alphabet].length);
  let result = 0n;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const digit = charTable.get(character);
    if (digit === undefined) {
      throw new Base62Error(
        `invalid character ${JSON.stringify(character)} at position ${index}`,
      );
    }
    result = result * base + BigInt(digit);
  }
  return result;
}
