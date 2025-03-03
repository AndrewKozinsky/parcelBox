import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { agent as request } from 'supertest'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeProductionMode } from '../utils/common'
import { createApp } from '../utils/createMainApp'

describe('Delete all data (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let moduleFixture: TestingModule

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		moduleFixture = createMainAppRes.moduleFixture
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it.only('should return error if request was made not in development mode', async () => {
		makeProductionMode(moduleFixture)

		const res = await request(app.getHttpServer()).delete('/' + RouteNames.TESTING.ALL_DATA)

		expect(res.status).toBe(HttpStatus.BAD_REQUEST)
		expect(res.body).toStrictEqual({ message: errorMessage.onlyDevMode })
	})

	it('should erase all data from the database', async () => {})
})
