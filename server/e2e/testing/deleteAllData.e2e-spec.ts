import { HttpStatus, INestApplication } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { TestingModule } from '@nestjs/testing'
import { agent as request } from 'supertest'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
import RouteNames from '../../src/infrastructure/routeNames'
import { DevicesRepository } from '../../src/repo/devices.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { setProductionMode } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { userUtils } from '../utils/userUtils'
import '../utils/jestExtendFunctions'

describe.skip('Delete all data (e2e)', () => {
	let app: INestApplication<App>
	let commandBus: CommandBus
	let moduleFixture: TestingModule
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let devicesRepository: DevicesRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		commandBus = app.get(CommandBus)
		moduleFixture = createMainAppRes.moduleFixture
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		devicesRepository = await app.resolve(DevicesRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
	})

	it('should erase all data from the database', async () => {
		await userUtils.createUserAndLogin({ app, userRepository, role: UserRole.Admin })

		const res = await request(app.getHttpServer()).delete('/' + RouteNames.TESTING.ALL_DATA)

		// Check the answer
		expect(res.status).toBe(HttpStatus.NO_CONTENT)
		expect(res.body).toEqual({})

		// Check if there isn't any users in the database
		const allUsers = await userRepository.getAllUsers()
		expect(allUsers.length).toBe(0)

		// Check if there isn't any device tokens in the database
		const allDevices = await devicesRepository.getAllDevices()
		expect(allDevices.length).toBe(0)
	})

	it('should return error if request was made not in development mode', async () => {
		setProductionMode(moduleFixture)

		const res = await request(app.getHttpServer()).delete('/' + RouteNames.TESTING.ALL_DATA)

		expect(res.status).toBe(HttpStatus.BAD_REQUEST)
		expect(res.body).toStrictEqual({ message: errorMessage.onlyDevMode })
	})
})
