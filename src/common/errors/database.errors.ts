abstract class ExceptionBase<T = null> extends Error {
  public readonly extra?: T | null

  protected constructor(message: string, extra?: T) {
    super(message)
    this.name = new.target.name
    this.extra = extra ?? null
  }
}

export class DuplicateResourceException extends ExceptionBase<{ duplicateFields: string[] }> {
  constructor(message: string, extra?: { duplicateFields: string[] }) {
    super(message, extra)
  }
}
