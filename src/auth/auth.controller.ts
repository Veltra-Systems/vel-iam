import { Body, Controller, Post } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import type { PartialResponse } from '../common/interceptors/transform-response.interceptor'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto): PartialResponse {
    return this.authService.register(body.email, body.password)
  }
}
