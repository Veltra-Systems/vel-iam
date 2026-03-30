import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'

describe('AuthService', () => {
  let service: AuthService

  // TODO: Mock > common?
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
      // TODO: Mock?
      userServiceMock.register.mockReturnValue({
        message: 'The user registered successfully.',
      })

      const email = 'test@example.com'
      const password = 'pass-example'

      const response = await service.register(email, password)

      expect(userServiceMock.register).toHaveBeenCalledTimes(1)
      expect(userServiceMock.register).toHaveBeenCalledWith(email, password)

      expect(response).toEqual({
        message: 'The user registered successfully.',
      })
    })
  })
})
