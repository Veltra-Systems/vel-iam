import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'

interface UserResponse {
  email: string
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(email: string, password: string): Promise<UserResponse> {
    const user = await this.userService.register(email, password)

    return {
      email: user.email,
    }
  }
}
