import type { User } from '@prisma/client'

export const userFactory = (overrides?: Partial<User>): User => ({
  id: '1',
  email: 'test@example.com',
  passwordHash: 'pass-example',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})
