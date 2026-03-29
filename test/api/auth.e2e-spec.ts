import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { CustomValidationPipe } from '../../src/common/pipes/customValidationPipe'
import type { Server } from 'http'
import { TransformResponseInterceptor } from '../../src/common/interceptors/transform-response.interceptor'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let server: Server

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    // TODO: Mock?
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new CustomValidationPipe())
    app.useGlobalInterceptors(new TransformResponseInterceptor())

    await app.init()
    server = app.getHttpServer() as Server
  })

  describe('register', () => {
    const url = '/auth/register'

    it('returns a successful response (POST)', async () => {
      const response = await request(server)
        .post(url)
        .send({
          email: 'test@example.com',
          password: 'pass-example',
        })
        .expect(201)

      expect(response.body).toEqual({
        code: 'Success',
        message: 'The user registered successfully.',
        data: null,
      })
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
