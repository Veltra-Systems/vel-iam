import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { UserService } from './user.service'
import { DatabaseService } from '../database/database.service'
import { createDatabaseMock } from '../common/tests/mocks/database.mock'
import { userFactory } from '../common/tests/factories/user.factory'

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
    it('returns a successful response', async () => {
      const email = 'test@example.con'
      const password = 'pass.example'

      databaseServiceMock.user.create.mockReturnValue(
        userFactory({
          email,
          passwordHash: password,
        }),
      )

      const response = await service.register(email, password)

      expect(databaseServiceMock.user.create).toHaveBeenCalledTimes(1)
      expect(databaseServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          email,
          passwordHash: password,
        },
      })

      expect(response).toEqual({
        message: 'The user registered successfully.',
      })
    })
  })
})
