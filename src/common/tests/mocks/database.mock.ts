export const createDatabaseMock = (): { user: { create: jest.Mock } } => ({
  user: {
    create: jest.fn(),
  },
})
