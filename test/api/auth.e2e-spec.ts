import request from 'supertest'
import type { Server } from 'http'
import type { DatabaseService } from '../../src/database/database.service'
import { cleanupTestApp, clearTables, setupTestApp } from '../setup-test'
import { UserService } from '../../src/user/user.service'
import type { INestApplication } from '@nestjs/common'

describe('AuthController (e2e)', () => {
  let server: Server
  let databaseService: DatabaseService
  let userService: UserService

  beforeAll(async () => {
    const setup = (await setupTestApp()) as {
      server: Server
      db: DatabaseService
      app: INestApplication
    }

    server = setup.server
    databaseService = setup.db

    userService = setup.app.get(UserService)
  })

  afterEach(async () => {
    await clearTables()
  })

  afterAll(async () => {
    await cleanupTestApp()
  })

  describe('register', () => {
    const url = '/auth/register'

    const body = {
      email: 'test@example.com',
      password: 'pass-example',
    }

    it('returns a successful response (POST)', async () => {
      const response = await request(server).post(url).send(body).expect(201)

      expect(response.body).toEqual({
        code: 200,
        message: 'The user registered successfully.',
        data: {
          email: body.email,
        },
      })

      const resultUser = await databaseService.user.findUnique({
        where: { email: body.email },
      })

      expect(resultUser).toBeDefined()
      expect(resultUser?.email).toBe(body.email)
      expect(resultUser?.passwordHash).toBe(body.password)
    })

    it('returns errors when body is empty', async () => {
      const response = await request(server).post(url).send({}).expect(400)

      expect(response.body).toEqual({
        code: 400,
        error: 'BAD_REQUEST',
        message: 'The request contains invalid data.',
        details: [
          {
            email: {
              isEmail: 'email must be an email',
              isNotEmpty: 'email should not be empty',
            },
            password: {
              isNotEmpty: 'password should not be empty',
            },
          },
        ],
      })
    })

    it('returns errors when fields is empty', async () => {
      const response = await request(server)
        .post(url)
        .send({
          email: '',
          password: '',
        })
        .expect(400)

      expect(response.body).toEqual({
        code: 400,
        error: 'BAD_REQUEST',
        message: 'The request contains invalid data.',
        details: [
          {
            email: {
              isEmail: 'email must be an email',
              isNotEmpty: 'email should not be empty',
            },
            password: {
              isNotEmpty: 'password should not be empty',
            },
          },
        ],
      })
    })

    it('returns errors when fields is not email', async () => {
      const response = await request(server)
        .post(url)
        .send({
          email: 'is-not-email',
          password: 'pass-example',
        })
        .expect(400)

      expect(response.body).toEqual({
        code: 400,
        error: 'BAD_REQUEST',
        message: 'The request contains invalid data.',
        details: [
          {
            email: {
              isEmail: 'email must be an email',
            },
          },
        ],
      })
    })

    it('returns duplicate email error when email already exists', async () => {
      await databaseService.user.create({
        data: {
          email: body.email,
          passwordHash: body.password,
        },
      })

      const response = await request(server).post(url).send(body).expect(409)

      expect(response.body).toEqual({
        code: 101,
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'The email address entered already exists',
      })
    })

    it('returns internal error when an unexpected error occurs', async () => {
      jest
        .spyOn(databaseService.user, 'create')
        .mockRejectedValueOnce(new Error('Unexpected DB error'))

      const response = await request(server).post(url).send(body).expect(500)

      expect(response.body).toEqual({
        code: 102,
        error: 'INTERNAL_ERROR',
        message: 'An internal error occurred within the system',
      })
    })

    it('returns default error when error is not controlled', async () => {
      jest.spyOn(userService, 'register').mockImplementationOnce(() => {
        throw new Error('unexpected error')
      })

      const response = await request(server).post(url).send(body).expect(500)

      expect(response.body).toEqual({
        code: 100,
        error: 'UNKNOWN',
        message: 'Something unexpected happened',
      })
    })
  })
})
