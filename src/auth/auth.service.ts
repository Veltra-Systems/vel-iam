import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'

interface ResponseAuth {
  message: string
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(email: string, password: string): Promise<ResponseAuth> {
    await this.userService.register(email, password)

    return {
      message: 'The user registered successfully.',
    }
  }
}
