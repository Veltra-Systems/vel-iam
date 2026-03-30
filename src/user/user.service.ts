import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

interface ResponseUser {
  message: string
}

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  async register(email: string, password: string): Promise<ResponseUser> {
    await this.database.user.create({
      data: {
        email,
        passwordHash: password,
      },
    })

    return {
      message: 'The user registered successfully.',
    }
  }
}
