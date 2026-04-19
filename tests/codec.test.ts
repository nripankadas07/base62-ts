import { ALPHABET, Base62Error, createCodec } from '../src';

describe('createCodec', () => {
  it('defaults to the Base62 alphabet', () => {
    const c = createCodec();
    expect(c.alphabet).toBe(ALPHABET);
    expect(c.encodeNumber(62)).toBe('10');
    expect(c.decodeNumber('10')).toBe(62n);
  });
  it('supports a Base58 alphabet', () => {
    const c = createCodec('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
    expect(c.encodeNumber(0)).toBe('1');
    expect(c.encodeNumber(57)).toBe('z');
    expect(c.encodeNumber(58)).toBe('21');
    expect(c.decodeNumber('21')).toBe(58n);
  });
  it('supports a Base16 hex alphabet', () => {
    const c = createCodec('0123456789abcdef');
    expect(c.encodeNumber(0)).toBe('0');
    expect(c.encodeNumber(255)).toBe('ff');
    expect(c.decodeNumber('ff')).toBe(255n);
  });
  it('supports a binary alphabet', () => {
    const c = createCodec('01');
    expect(c.encodeNumber(5)).toBe('101');
    expect(c.decodeNumber('10110')).toBe(22n);
  });
  it('rejects non-string alphabets', () => expect(() => createCodec(123 as any)).toThrow(Base62Error));
  it('rejects alphabets with fewer than 2 characters', () => {
    expect(() => createCodec('')).toThrow(/at least 2/);
    expect(() => createCodec('a')).toThrow(/at least 2/);
  });
  it('rejects alphabets with duplicate characters', () => expect(() => createCodec('abcabc')).toThrow(/duplicate/));
  it('rejects alphabets with surrogate-pair characters', () => expect(() => createCodec('ab😀c')).toThrow(/BMP/));
  it('round-trips an arbitrary custom alphabet', () => {
    const c = createCodec('!@#$%^&*()-_=+[]{}|;:,.<>/?ABCDEFGHIJabcdefghijKLMNOPqrstuvwx');
    for (let v = 0; v < 10000; v += 251) expect(c.decodeNumber(c.encodeNumber(v))).toBe(BigInt(v));
  });
});
