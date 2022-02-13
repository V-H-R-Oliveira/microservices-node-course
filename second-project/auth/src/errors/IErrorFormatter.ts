interface IError {
    message: string
    field?: string
}

interface IErrorFormat {
    errors: IError[]
    statusCode: number
}

interface IErrorFormatter {
    formatError(): IErrorFormat
}

export { IError, IErrorFormat, IErrorFormatter }