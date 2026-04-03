import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common'
import { Response } from 'express'
import {
  DuplicateResourceException,
  ExceptionBase,
  UnhandledException,
} from '../errors/database.errors'
import { TypeErrorMap } from '../errors/error-types'

export interface ErrorResponse {
  status: number
  code: number
  error: string
  message: string
  details?: unknown
}

type ErrorEntry = {
  type: new (...args: never[]) => ExceptionBase<unknown>
  response: ErrorResponse
}

const errorMap: ErrorEntry[] = [
  {
    type: DuplicateResourceException,
    response: {
      status: HttpStatus.CONFLICT,
      code: TypeErrorMap.EMAIL_ALREADY_EXISTS.code,
      error: TypeErrorMap.EMAIL_ALREADY_EXISTS.name,
      message: 'The email address entered already exists',
    },
  },
  {
    type: UnhandledException,
    response: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: TypeErrorMap.INTERNAL_ERROR.code,
      error: TypeErrorMap.INTERNAL_ERROR.name,
      message: 'An internal error occurred within the system',
    },
  },
]

@Catch()
export class ResponseExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      const { status, ...resultException } = exception.getResponse() as ErrorResponse
      response.status(status).json(resultException)
      return
    }

    let resultError: ErrorResponse = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: TypeErrorMap.UNKNOWN.code,
      error: TypeErrorMap.UNKNOWN.name,
      message: 'Something unexpected happened',
    }

    if (exception instanceof ExceptionBase) {
      const match = errorMap.find((e) => exception instanceof e.type)
      if (match) {
        resultError = {
          ...match.response,
        }
      }
    }

    const { status, ...resultException } = resultError

    response.status(status).json(resultException)
  }
}
