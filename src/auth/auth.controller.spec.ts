import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let controller: AuthController

  // TODO: Mock > common?
  const authServiceMock = {
    register: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  describe('register', () => {
    it('returns a successful response', async () => {
      // TODO: Mock?
      authServiceMock.register.mockReturnValue({
        message: 'The user registered successfully.',
      })

      const body = {
        email: 'test@example.com',
        password: 'pass-example',
      }

      const response = await controller.register(body)

      expect(authServiceMock.register).toHaveBeenCalledTimes(1)
      expect(authServiceMock.register).toHaveBeenCalledWith(body.email, body.password)

      expect(response).toEqual({
        message: 'The user registered successfully.',
      })
    })
  })
})
