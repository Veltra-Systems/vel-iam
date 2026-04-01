import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { UserService } from './user.service'
import { DatabaseService } from '../database/database.service'
import { createDatabaseMock } from '../common/tests/mocks/database.mock'
import { userFactory } from '../common/tests/factories/user.factory'
import type { User } from '@prisma/client'
import { Prisma } from '@prisma/client'

describe('UserService', () => {
  let service: UserService
  let databaseServiceMock: ReturnType<typeof createDatabaseMock>

  beforeEach(async () => {
    databaseServiceMock = createDatabaseMock()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: databaseServiceMock,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  describe('register', () => {
    const executeRegister = async (email: string, password: string): Promise<User> => {
      return await service.register(email, password)
    }

    const email = 'test@example.con'
    const password = 'pass.example'

    it('returns a successful response', async () => {
      const userMock = userFactory({
        email,
        passwordHash: password,
      })

      databaseServiceMock.user.create.mockResolvedValue(userMock)

      const response = await executeRegister(email, password)

      expect(databaseServiceMock.user.create).toHaveBeenCalledTimes(1)
      expect(databaseServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          email,
          passwordHash: password,
        },
      })

      expect(response).toEqual(userMock)
    })

    it('throws error when email already exists', async () => {
      // TODO: Util ?
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      })

      // TODO: Mock util ?
      databaseServiceMock.user.create.mockRejectedValue(prismaError)

      const response = executeRegister(email, password)

      await expect(response).rejects.toThrow('Email already exists')
    })
  })
})
