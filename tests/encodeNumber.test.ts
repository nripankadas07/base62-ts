import { ALPHABET, Base62Error, decodeNumber, encodeNumber } from '../src';

describe('encodeNumber', () => {
  it('encodes zero as the first alphabet character', () => {
    expect(encodeNumber(0)).toBe(ALPHABET[0]);
    expect(encodeNumber(0)).toBe('0');
  });

  it('encodes the full single-digit range', () => {
    for (let v = 0; v < 62; v += 1) expect(encodeNumber(v)).toBe(ALPHABET[v]);
  });

  it('carries into the second digit at exactly 62', () => {
    expect(encodeNumber(62)).toBe('10');
    expect(encodeNumber(63)).toBe('11');
    expect(encodeNumber(62 * 62 - 1)).toBe('zz');
    expect(encodeNumber(62 * 62)).toBe('100');
  });

  it('handles bigint inputs', () => {
    expect(encodeNumber(0n)).toBe('0');
    expect(encodeNumber(62n)).toBe('10');
  });

  it('roundtrips past Number.MAX_SAFE_INTEGER via bigint', () => {
    const v = (1n << 128n) + 7n;
    expect(decodeNumber(encodeNumber(v))).toBe(v);
  });

  it('rejects negative numbers', () => {
    expect(() => encodeNumber(-1)).toThrow(Base62Error);
    expect(() => encodeNumber(-1n)).toThrow(Base62Error);
  });

  it('rejects non-integers', () => expect(() => encodeNumber(1.5)).toThrow(/integer/));

  it('rejects NaN and Infinity', () => {
    expect(() => encodeNumber(Number.NaN)).toThrow(/finite/);
    expect(() => encodeNumber(Number.POSITIVE_INFINITY)).toThrow(/finite/);
    expect(() => encodeNumber(Number.NEGATIVE_INFINITY)).toThrow(/finite/);
  });

  it('rejects non-numeric types', () => {
    expect(() => encodeNumber('7' as any)).toThrow(/number or bigint/);
    expect(() => encodeNumber(null as any)).toThrow(/number or bigint/);
    expect(() => encodeNumber(undefined as any)).toThrow(/number or bigint/);
  });
});
