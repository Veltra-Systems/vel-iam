import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { User, Prisma } from '@prisma/client'
import {
  DuplicateResourceException,
  InvalidResourceException,
} from '../common/errors/database.errors'

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  async register(email: string, password: string): Promise<User> {
    if (!email?.trim() || !password?.trim()) {
      throw new InvalidResourceException('Invalid field format', {
        validFormatFields: {
          email: ['notNullEmpty', 'string'],
          password: ['notNullEmpty', 'string'],
        },
      })
    }

    try {
      return await this.database.user.create({
        data: {
          email,
          passwordHash: password,
        },
      })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const duplicateFields = ['email']

        throw new DuplicateResourceException('Duplicate data in user registration', {
          duplicateFields,
        })
      }

      throw new Error('Unhandled error')
    }
  }
}
