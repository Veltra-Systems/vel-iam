import { config } from 'dotenv'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import { DatabaseService } from '../src/database/database.service'
import { AppModule } from '../src/app.module'
import { CustomValidationPipe } from '../src/common/pipes/customValidationPipe'
import { TransformResponseInterceptor } from '../src/common/interceptors/transform-response.interceptor'
import type { Server } from 'http'

config({ path: '.env.test' })

let app: INestApplication
let db: DatabaseService
let server: Server

export async function setupTestApp(): Promise<{
  app: INestApplication
  server: Server
  db: DatabaseService
}> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  app = module.createNestApplication()
  app.useGlobalPipes(new CustomValidationPipe())
  app.useGlobalInterceptors(new TransformResponseInterceptor())
  await app.init()

  db = module.get(DatabaseService)
  await db.$connect()

  server = app.getHttpServer() as Server

  return { app, server, db }
}

export async function clearTables(): Promise<void> {
  await db.user.deleteMany()
}

export async function cleanupTestApp(): Promise<void> {
  await db.$disconnect()
  await app.close()
}
