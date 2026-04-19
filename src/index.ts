import { ALPHABET } from './alphabet';
import { Base62Codec, createCodec } from './codec';
import { Base62Error } from './errors';

const defaultCodec: Base62Codec = createCodec(ALPHABET);

export function encodeNumber(value: number | bigint): string {
  return defaultCodec.encodeNumber(value);
}

export function decodeNumber(text: string): bigint {
  return defaultCodec.decodeNumber(text);
}

export function encodeBytes(data: Uint8Array | readonly number[]): string {
  return defaultCodec.encodeBytes(data);
}

export function decodeBytes(text: string): Uint8Array {
  return defaultCodec.decodeBytes(text);
}

export { ALPHABET, Base62Codec, Base62Error, createCodec };
