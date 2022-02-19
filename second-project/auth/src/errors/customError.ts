import { IErrorFormat } from "./IError"

export default abstract class CustomError extends Error  {
    constructor(public message: string, protected _statusCode: number) {
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    get statusCode(): number {
        return this.statusCode
    }

    abstract formatError(): IErrorFormat
}