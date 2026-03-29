import { Body, Controller, Post } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import type { PartialResponse } from '../common/interceptors/transform-response.interceptor'

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() body: RegisterDto): PartialResponse {
    void body

    return {
      message: 'The user registered successfully.',
    }
  }
}
