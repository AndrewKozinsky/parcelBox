import { INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { agent as request } from 'supertest'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { DevicesRepository } from '../../src/repo/devices.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { createApp } from '../utils/createMainApp'

describe.only('Seed all data (e2e)', () => {
	let app: INestApplication<App>
	let moduleFixture: TestingModule
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let devicesRepository: DevicesRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		moduleFixture = createMainAppRes.moduleFixture
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		devicesRepository = await app.resolve(DevicesRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return error if request was made not in development mode', async () => {
		const res = await request(app.getHttpServer()).post('/' + RouteNames.TESTING.SEED_TEST_DATA)
	})
})
