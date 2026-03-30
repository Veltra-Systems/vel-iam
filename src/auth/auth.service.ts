import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'

interface ResponseAuth {
  message: string
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(email: string, password: string): Promise<ResponseAuth> {
    return await this.userService.register(email, password)
  }
}
