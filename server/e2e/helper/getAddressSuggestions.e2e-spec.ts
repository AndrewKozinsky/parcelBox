import { INestApplication } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
import { queries } from '../../src/features/test/queries'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { JwtAdapterService } from '../../src/infrastructure/jwtAdapter/jwtAdapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellRepository } from '../../src/repo/cell.repository'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { DevicesRepository } from '../../src/repo/devices.repository'
import { ParcelBoxQueryRepository } from '../../src/repo/parcelBox.queryRepository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeQueryRepository } from '../../src/repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq, makeGraphQLReqWithTokens } from '../makeGQReq'
import { authUtils } from '../utils/authUtils'
import { defAdminEmail, defAdminPassword, seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { parcelBoxTypeUtils } from '../utils/parcelBoxTypeUtils'
import { parcelBoxUtils } from '../utils/parcelBoxUtils'
import { seedTestData } from '../utils/seedTestData'
import { userUtils } from '../utils/userUtils'

describe('Get address suggestions my parcel box (e2e)', () => {
	let app: INestApplication<App>
	let commandBus: CommandBus
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let parcelBoxTypeRepository: ParcelBoxTypeRepository
	let parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository
	let cellTypeRepository: CellTypeRepository
	let parcelBoxQueryRepository: ParcelBoxQueryRepository
	let parcelBoxRepository: ParcelBoxRepository
	let cellRepository: CellRepository
	let devicesRepository: DevicesRepository
	let jwtAdapter: JwtAdapterService
	let mainConfig: MainConfigService

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		commandBus = app.get(CommandBus)
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeRepository)
		parcelBoxTypeQueryRepository = await app.resolve(ParcelBoxTypeQueryRepository)
		cellTypeRepository = await app.resolve(CellTypeRepository)
		parcelBoxQueryRepository = await app.resolve(ParcelBoxQueryRepository)
		parcelBoxRepository = await app.resolve(ParcelBoxRepository)
		cellRepository = await app.resolve(CellRepository)
		devicesRepository = await app.resolve(DevicesRepository)
		jwtAdapter = await app.resolve(JwtAdapterService)
		mainConfig = await app.resolve(MainConfigService)
	})

	beforeEach(async () => {
		await clearAllDB(app)
		await seedInitDataInDatabase(app)
		// await seedTestData(commandBus)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it.only('should ', async () => {
		// Try to get created parcel boxes
		const getAddressSuggestionsQuery = queries.helper.getAddressSuggestions('Оренбург, транспортная')
		const [getAddressSuggestionsRes] = await makeGraphQLReq(app, getAddressSuggestionsQuery)
		console.log(getAddressSuggestionsRes)
		// const getAddressSuggestionsData = getAddressSuggestionsRes.data[RouteNames.HELPER.ADDRESS_SUGGESTIONS]
		// console.log(getAddressSuggestionsData)
	})
})
