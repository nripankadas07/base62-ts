import { Base62Error, decodeNumber, encodeNumber } from '../src';

describe('decodeNumber', () => {
  it('decodes single digits back to bigint', () => {
    expect(decodeNumber('0')).toBe(0n);
    expect(decodeNumber('9')).toBe(9n);
    expect(decodeNumber('A')).toBe(10n);
    expect(decodeNumber('z')).toBe(61n);
  });
  it('decodes multi-digit strings', () => {
    expect(decodeNumber('10')).toBe(62n);
    expect(decodeNumber('11')).toBe(63n);
    expect(decodeNumber('zz')).toBe(62n * 62n - 1n);
    expect(decodeNumber('100')).toBe(62n * 62n);
  });
  it('is the inverse of encodeNumber across a wide range', () => {
    for (const v of [0n, 1n, 61n, 62n, 999n, 1000000n, 1n << 64n]) expect(decodeNumber(encodeNumber(v))).toBe(v);
  });
  it('rejects the empty string', () => expect(() => decodeNumber('')).toThrow(/empty/));
  it('rejects invalid characters and reports the index', () => {
    try { decodeNumber('ab!c'); fail('expected Base62Error'); }
    catch (e) { expect(e).toBeInstanceOf(Base62Error); expect((e as Error).message).toMatch(/position 2/); }
  });
  it('rejects non-string input', () => {
    expect(() => decodeNumber(7 as any)).toThrow(/string/);
    expect(() => decodeNumber(null as any)).toThrow(/string/);
  });
});
