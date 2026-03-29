import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  describe('registerUser', () => {
    it('returns a successful response', () => {
      const response = controller.register()

      expect(response).toEqual({
        message: 'The user registered successfully.',
      })
    })
  })
})
