import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common'
import { Response } from 'express'
import {
  DuplicateResourceException,
  ExceptionBase,
  UnhandledException,
} from '../errors/database.errors'

interface ErrorResponse {
  status: number
  code: number
  error: string
  message: string
}

type ExceptionConstructor = new (...args: any[]) => ExceptionBase

const errorMap = new Map<ExceptionConstructor, ErrorResponse>([
  [
    DuplicateResourceException,
    {
      status: HttpStatus.CONFLICT,
      code: 101,
      error: 'EmailAlreadyExists',
      message: 'The email address entered already exists',
    },
  ],
  [
    UnhandledException,
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 102,
      error: 'InternalError',
      message: 'An internal error occurred within the system',
    },
  ],
])

@Catch()
export class ResponseExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse())
      return
    }

    let resultError: ErrorResponse = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 100,
      error: 'ErrorNotFound',
      message: 'Something unexpected happened',
    }

    if (exception instanceof ExceptionBase) {
      resultError = errorMap.get(exception.constructor) ?? resultError
    }

    response.status(resultError.status).json({
      code: resultError.code,
      error: resultError.error,
      message: resultError.message,
    })
  }
}
