import { IErrorPromiseReject } from 'shared-libs'
export function getErrorObject(errors: IErrorPromiseReject<any>) {
    const checkError =
        errors.checkError &&
        errors.checkError.status &&
        errors.checkError.message
            ? errors.checkError
            : { status: 500, message: 'Something go wrong' }

    const simpleMessage = errors.inputError?.name
        ? 'HTTP 400 Bad Request: Something go wrong with the variables that you send'
        : checkError.message

    const errorDevelopment = JSON.stringify(
        {
            inputZodError: errors.inputError,
            serverError: errors.serverError,
            checkFnError: errors.checkError,
        },
        undefined,
        4
    )

    console.error(`Error - ${new Date().toISOString()}: `, errorDevelopment)

    if (process.env.NODE_ENV === 'production') return simpleMessage

    return errorDevelopment
}
