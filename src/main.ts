import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { CustomValidationPipe } from './common/pipes/customValidationPipe'
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor'
import { ResponseExceptionsFilter } from './common/filters/response-exceptions.filter'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new CustomValidationPipe())
  app.useGlobalInterceptors(new TransformResponseInterceptor())
  app.useGlobalFilters(new ResponseExceptionsFilter())

  const configService = app.get(ConfigService)
  const port = configService.getOrThrow<number>('PORT')

  await app.listen(port)
}

void bootstrap()
