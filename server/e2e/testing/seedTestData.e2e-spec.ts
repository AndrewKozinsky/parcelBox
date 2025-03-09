import { INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { CellRepository } from '../../src/repo/cell.repository'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { DevicesRepository } from '../../src/repo/devices.repository'
import { ParcelBoxQueryRepository } from '../../src/repo/parcelBox.queryRepository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeQueryRepository } from '../../src/repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { seedTestData } from '../utils/seedTestData'
import { seedTestDataConfig } from '../utils/seedTestDataConfig'

describe.skip('Seed all data (e2e)', () => {
	let app: INestApplication<App>
	let moduleFixture: TestingModule
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let devicesRepository: DevicesRepository
	let parcelBoxTypeRepository: ParcelBoxTypeRepository
	let parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository
	let cellTypeRepository: CellTypeRepository
	let parcelBoxQueryRepository: ParcelBoxQueryRepository
	let parcelBoxRepository: ParcelBoxRepository
	let cellRepository: CellRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		moduleFixture = createMainAppRes.moduleFixture
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		devicesRepository = await app.resolve(DevicesRepository)
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeRepository)
		parcelBoxTypeQueryRepository = await app.resolve(ParcelBoxTypeQueryRepository)
		cellTypeRepository = await app.resolve(CellTypeRepository)
		parcelBoxQueryRepository = await app.resolve(ParcelBoxQueryRepository)
		parcelBoxRepository = await app.resolve(ParcelBoxRepository)
		cellRepository = await app.resolve(CellRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
		await seedInitDataInDatabase(app)
		await seedTestData({
			app,
			userRepository,
			parcelBoxRepository,
			cellRepository,
			parcelBoxTypeRepository,
		})
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('test data should contain 8 users', async () => {
		const usersConfig = seedTestDataConfig.getUsersConfig()
		for (let userEmail in usersConfig) {
			const user = userRepository.getUserByEmail(userEmail)
			expect(user).toBeTruthy()
		}
	})

	it('two admins must have parcel boxes', async () => {
		const usersParcelBoxesConfig = seedTestDataConfig.getUsersParcelBoxesConfig()

		for (let userEmail in usersParcelBoxesConfig) {
			const parcelBoxesConfigOfUser = usersParcelBoxesConfig[userEmail]

			// Get all user parcel boxes
			const userParcelBoxes = await parcelBoxRepository.getParcelBoxesByUserEmail(userEmail)

			// Calculate all user's boxes count
			let parcelBoxesTotalCount = 0
			for (let parcelBoxName in parcelBoxesConfigOfUser) {
				parcelBoxesTotalCount += parcelBoxesConfigOfUser[parcelBoxName]
			}

			expect(userParcelBoxes.length).toBe(parcelBoxesTotalCount)
		}
	})
})
