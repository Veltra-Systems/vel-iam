import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envValidation } from './config/env.validation'
import { AuthController } from './auth/auth.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidation,
    }),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
