/**
 * Single error class for every validation or decoding failure in this library.
 * A distinct class (instead of a bare Error) lets consumers catch library
 * errors without accidentally swallowing unrelated runtime exceptions.
 */
export class Base62Error extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'Base62Error';
    Object.setPrototypeOf(this, Base62Error.prototype);
  }
}
