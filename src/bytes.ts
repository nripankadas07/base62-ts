import { Base62Error } from './errors';
import { decodeInt, encodeInt } from './number';

export function toUint8Array(data: Uint8Array | readonly number[]): Uint8Array {
  if (data instanceof Uint8Array) return data;
  if (!Array.isArray(data)) throw new Base62Error('data must be a Uint8Array or number[]');
  const copy = new Uint8Array(data.length);
  for (let index = 0; index < data.length; index += 1) {
    const byte = data[index];
    if (typeof byte !== 'number' || !Number.isInteger(byte) || byte < 0 || byte > 255) {
      throw new Base62Error(`byte at index ${index} must be an integer in [0, 255]`);
    }
    copy[index] = byte;
  }
  return copy;
}

export function encodeBytes(data: Uint8Array | readonly number[], alphabet: string): string {
  const bytes = toUint8Array(data);
  if (bytes.length === 0) return '';
  let leadingZeros = 0;
  while (leadingZeros < bytes.length && bytes[leadingZeros] === 0) leadingZeros += 1;
  let value = 0n;
  for (let index = leadingZeros; index < bytes.length; index += 1) {
    value = (value << 8n) | BigInt(bytes[index]);
  }
  const encodedBody = leadingZeros === bytes.length ? '' : encodeInt(value, alphabet);
  return alphabet[0].repeat(leadingZeros) + encodedBody;
}

export function decodeBytes(text: string, alphabet: string, charTable: Map<string, number>): Uint8Array {
  if (typeof text !== 'string') throw new Base62Error('encoded value must be a string');
  if (text.length === 0) return new Uint8Array(0);
  const zeroChar = alphabet[0];
  let leadingZeros = 0;
  while (leadingZeros < text.length && text[leadingZeros] === zeroChar) leadingZeros += 1;
  if (leadingZeros === text.length) return new Uint8Array(leadingZeros);
  const body = text.slice(leadingZeros);
  const value = decodeInt(body, alphabet, charTable);
  const valueBytes = bigintToBytes(value);
  const out = new Uint8Array(leadingZeros + valueBytes.length);
  out.set(valueBytes, leadingZeros);
  return out;
}

function bigintToBytes(value: bigint): Uint8Array {
  if (value === 0n) return new Uint8Array([0]);
  const bytes: number[] = [];
  let remaining = value;
  while (remaining > 0n) { bytes.push(Number(remaining & 0xffn)); remaining >>= 8n; }
  bytes.reverse();
  return new Uint8Array(bytes);
}
