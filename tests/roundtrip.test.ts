import { createCodec, decodeBytes, decodeNumber, encodeBytes, encodeNumber } from '../src';

describe('round-trip properties', () => {
  it('number round-trips across 0..100,000', () => {
    for (let v = 0; v <= 100000; v += 1) expect(decodeNumber(encodeNumber(v))).toBe(BigInt(v));
  });
  it('bigint round-trips across a large exponential range', () => {
    for (let s = 0n; s < 256n; s += 17n) { const v = 1n << s; expect(decodeNumber(encodeNumber(v))).toBe(v); }
  });
  it('bytes round-trip across 1..100 buffers', () => {
    for (let L = 1; L <= 100; L += 1) {
      const b = new Uint8Array(L);
      for (let i = 0; i < L; i += 1) b[i] = (i * 131 + L * 17) & 0xff;
      const d = decodeBytes(encodeBytes(b));
      expect(d.length).toBe(b.length);
      for (let i = 0; i < L; i += 1) expect(d[i]).toBe(b[i]);
    }
  });
  it('byte encoding preserves leading-zero count exactly', () => {
    for (let lz = 0; lz <= 10; lz += 1) {
      const b = new Uint8Array(lz + 3); b[b.length-3]=1; b[b.length-2]=2; b[b.length-1]=3;
      const d = decodeBytes(encodeBytes(b));
      let a = 0; while (a < d.length && d[a] === 0) a += 1;
      expect(a).toBe(lz);
    }
  });
  it('number round-trips under a random non-default alphabet', () => {
    const c = createCodec('ZABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxyz0123456789');
    for (let v = 0; v < 100000; v += 999) expect(c.decodeNumber(c.encodeNumber(v))).toBe(BigInt(v));
  });
});
