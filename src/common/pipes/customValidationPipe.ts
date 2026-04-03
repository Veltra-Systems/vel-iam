import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
  ValidationPipe,
  ValidationError,
  HttpStatus,
} from '@nestjs/common'
import { ErrorResponse } from '../filters/response-exceptions.filter'
import { TypeErrorMap } from '../errors/error-types'

@Injectable()
export class CustomValidationPipe extends ValidationPipe implements PipeTransform {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const details: Record<string, Record<string, string>> = {}
        errors.forEach((err) => {
          details[err.property] = err.constraints ?? {}
        })

        const response: ErrorResponse = {
          status: HttpStatus.BAD_REQUEST,
          code: TypeErrorMap.BAD_REQUEST.code,
          error: TypeErrorMap.BAD_REQUEST.name,
          message: 'The request contains invalid data.',
          details: [details],
        }

        throw new BadRequestException(response)
      },
    })
  }

  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    return super.transform(value, metadata)
  }
}
