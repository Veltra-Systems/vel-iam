import { Injectable } from '@nestjs/common'

interface ResponseAuth {
  message: string
}

@Injectable()
export class AuthService {
  register(email: string, password: string): ResponseAuth {
    void email
    void password

    return {
      message: 'The user registered successfully.',
    }
  }
}
