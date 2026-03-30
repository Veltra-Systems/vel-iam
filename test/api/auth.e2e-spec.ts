import request from 'supertest'
import type { Server } from 'http'
import type { DatabaseService } from '../../src/database/database.service'
import { cleanupTestApp, clearTables, setupTestApp } from '../setup-test'

describe('AuthController (e2e)', () => {
  let server: Server
  let databaseService: DatabaseService

  beforeAll(async () => {
    const setup = (await setupTestApp()) as { server: Server; db: DatabaseService }
    server = setup.server
    databaseService = setup.db
  })

  afterEach(async () => {
    await clearTables()
  })

  afterAll(async () => {
    await cleanupTestApp()
  })

  describe('register', () => {
    const url = '/auth/register'

    it('returns a successful response (POST)', async () => {
      const body = {
        email: 'test@example.com',
        password: 'pass-example',
      }

      const response = await request(server).post(url).send(body).expect(201)

      expect(response.body).toEqual({
        code: 'Success',
        message: 'The user registered successfully.',
        data: null,
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
        code: 'BadRequest',
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
        code: 'BadRequest',
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
        code: 'BadRequest',
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
  })
})
