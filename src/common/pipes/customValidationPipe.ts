import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common'

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

        throw new BadRequestException({
          message: 'The request contains invalid data.',
          // TODO: Enum?
          code: 'BadRequest',
          details: [details],
        })
      },
    })
  }

  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    return super.transform(value, metadata)
  }
}
