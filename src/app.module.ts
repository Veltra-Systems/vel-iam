import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envValidation } from './config/env.validation'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidation,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
