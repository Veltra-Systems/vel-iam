import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { userFactory } from '../common/tests/factories/user.factory'

describe('AuthService', () => {
  let service: AuthService

  // TODO: Mocks ?
  const userServiceMock = {
    register: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  describe('register', () => {
    it('returns a successful response', async () => {
      const email = 'test@example.com'
      const password = 'pass-example'

      const userMock = userFactory({
        email,
        passwordHash: password,
      })

      userServiceMock.register.mockResolvedValue(userMock)

      const response = await service.register(email, password)

      expect(userServiceMock.register).toHaveBeenCalledTimes(1)
      expect(userServiceMock.register).toHaveBeenCalledWith(email, password)

      expect(response).toEqual({
        email,
      })
    })
  })
})
