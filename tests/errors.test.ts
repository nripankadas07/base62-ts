import { Base62Error } from '../src';

describe('Base62Error', () => {
  it('is a subclass of Error', () => {
    const e = new Base62Error('boom');
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(Base62Error);
  });
  it('carries the message and name', () => {
    const e = new Base62Error('something broke');
    expect(e.message).toBe('something broke');
    expect(e.name).toBe('Base62Error');
  });
  it('has a useful stack trace', () => {
    const e = new Base62Error('boom');
    expect(typeof e.stack).toBe('string');
    expect(e.stack).toContain('Base62Error');
  });
});
