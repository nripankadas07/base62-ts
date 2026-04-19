import { ALPHABET, buildCharTable } from './alphabet';
import { decodeBytes, encodeBytes } from './bytes';
import { Base62Error } from './errors';
import { decodeInt, encodeInt, toNonNegativeBigInt } from './number';

export interface Base62Codec {
  readonly alphabet: string;
  encodeNumber(value: number | bigint): string;
  decodeNumber(text: string): bigint;
  encodeBytes(data: Uint8Array | readonly number[]): string;
  decodeBytes(text: string): Uint8Array;
}

export function createCodec(alphabet: string = ALPHABET): Base62Codec {
  const charTable = buildCharTable(alphabet);
  return {
    alphabet,
    encodeNumber(value) { return encodeInt(toNonNegativeBigInt(value), alphabet); },
    decodeNumber(text) { return decodeInt(text, alphabet, charTable); },
    encodeBytes(data) { return encodeBytes(data, alphabet); },
    decodeBytes(text) { return decodeBytes(text, alphabet, charTable); },
  };
}

export { Base62Error };
