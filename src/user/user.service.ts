import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { User, Prisma } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  async register(email: string, password: string): Promise<User> {
    try {
      return await this.database.user.create({
        data: {
          email,
          passwordHash: password,
        },
      })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new Error('Email already exists')
      }

      throw new Error('Unhandled error')
    }
  }
}
