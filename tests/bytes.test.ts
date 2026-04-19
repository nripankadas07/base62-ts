import { Base62Error, decodeBytes, encodeBytes } from '../src';

function same(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
}

describe('encodeBytes / decodeBytes', () => {
  it('round-trips the empty byte array', () => {
    const b = new Uint8Array(0);
    expect(encodeBytes(b)).toBe('');
    expect(decodeBytes('').length).toBe(0);
  });
  it('round-trips a single zero byte', () => {
    const b = new Uint8Array([0]);
    expect(encodeBytes(b)).toBe('0');
    expect(same(decodeBytes(encodeBytes(b)), b)).toBe(true);
  });
  it('preserves leading zero bytes', () => {
    const b = new Uint8Array([0, 0, 0, 42]);
    expect(encodeBytes(b).startsWith('000')).toBe(true);
    expect(same(decodeBytes(encodeBytes(b)), b)).toBe(true);
  });
  it('round-trips a small non-zero byte string', () => {
    const b = new Uint8Array([0x4e, 0x72, 0x69]);
    expect(same(decodeBytes(encodeBytes(b)), b)).toBe(true);
  });
  it('round-trips every 0..255 single-byte value', () => {
    for (let v = 0; v < 256; v += 1) {
      const b = new Uint8Array([v]);
      expect(same(decodeBytes(encodeBytes(b)), b)).toBe(true);
    }
  });
  it('round-trips a 32-byte buffer', () => {
    const b = new Uint8Array(32);
    for (let i = 0; i < b.length; i += 1) b[i] = (i * 37 + 91) & 0xff;
    expect(same(decodeBytes(encodeBytes(b)), b)).toBe(true);
  });
  it('accepts plain number[] as input', () => {
    const b = [1, 2, 3, 4, 5];
    expect(same(decodeBytes(encodeBytes(b)), new Uint8Array(b))).toBe(true);
  });
  it('rejects out-of-range byte values', () => {
    expect(() => encodeBytes([256])).toThrow(Base62Error);
    expect(() => encodeBytes([-1])).toThrow(/integer/);
    expect(() => encodeBytes([1.5])).toThrow(/integer/);
  });
  it('rejects non-array, non-Uint8Array input', () => expect(() => encodeBytes('hello' as any)).toThrow(/Uint8Array/));
  it('rejects non-string decode input', () => expect(() => decodeBytes(7 as any)).toThrow(/string/));
  it('rejects invalid decode characters with position', () => expect(() => decodeBytes('Nri!')).toThrow(/position 3/));
  it('handles an all-zero buffer of arbitrary size', () => {
    const b = new Uint8Array(8);
    expect(encodeBytes(b)).toBe('00000000');
    expect(same(decodeBytes(encodeBytes(b)), b)).toBe(true);
  });
});
