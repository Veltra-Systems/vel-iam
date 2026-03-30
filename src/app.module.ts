import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envValidation } from './config/env.validation'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { UserService } from './user/user.service'
import { DatabaseService } from './database/database.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.ENVIRONMENT === 'test' ? '.env.test' : '.env',
      validationSchema: envValidation,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, DatabaseService],
})
export class AppModule {}
