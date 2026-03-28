import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { envValidation } from './config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidation,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
