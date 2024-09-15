export class ValidationError extends Error {
  #message: string

  constructor(message: string) {
    super(message)
    this.#message = message
    Object.setPrototypeOf(this, ValidationError.prototype)
  }

  get message() {
    return this.#message
  }

  toJSON() {
    return {
      message: this.#message
    }
  }
}
