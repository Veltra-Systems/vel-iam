import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  describe('register', () => {
    it('returns a successful response', () => {
      const response = service.register()

      expect(response).toEqual({
        message: 'The user registered successfully.',
      })
    })
  })
})
