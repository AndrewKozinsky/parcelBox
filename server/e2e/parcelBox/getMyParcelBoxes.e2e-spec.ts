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
import { makeGraphQLReqWithTokens } from '../makeGQReq'
import { authUtils } from '../utils/authUtils'
import { defAdminEmail, defAdminPassword, seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { parcelBoxTypeUtils } from '../utils/parcelBoxTypeUtils'
import { parcelBoxUtils } from '../utils/parcelBoxUtils'
import { seedTestData } from '../utils/seedTestData'
import { userUtils } from '../utils/userUtils'

describe.skip('Get my parcel box (e2e)', () => {
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
		await seedTestData(commandBus)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return 401 if there is not access device token cookie', async () => {
		await authUtils.accessTokenChecks.tokenNotExist(app, queries.parcelBox.getMine())
	})

	it('should return 401 if the JWT accessToken inside cookie is expired', async () => {
		await authUtils.accessTokenChecks.tokenExpired({
			app,
			queryOrMutationStr: queries.parcelBox.getMine(),
			userRepository,
			devicesRepository,
			jwtAdapter,
			mainConfig,
			role: UserRole.Admin,
		})
	})

	it('should create two parcel boxes if passed data is valid', async () => {
		// Create an admin who will create a new parcel box
		const { loginData, accessToken, refreshToken } = await userUtils.createUserAndLogin({
			app,
			userRepository,
			role: UserRole.Admin,
			email: defAdminEmail,
			password: defAdminPassword,
		})

		if (!loginData || !accessToken) {
			throw new Error('Unable to login user')
		}

		// Get existing parcel box types
		const smallParcelBoxType = await parcelBoxTypeUtils.getByName({
			parcelBoxTypeName: 'small',
			parcelBoxTypeRepository,
		})
		const mediumParcelBoxType = await parcelBoxTypeUtils.getByName({
			parcelBoxTypeName: 'medium',
			parcelBoxTypeRepository,
		})

		// Create two parcel boxes based on the existing parcel box types
		await parcelBoxUtils.createParcelBoxWithCells({
			app,
			userId: loginData.id,
			parcelBoxTypeId: smallParcelBoxType.id,
			parcelBoxRepository,
			cellRepository,
		})
		await parcelBoxUtils.createParcelBoxWithCells({
			app,
			userId: loginData.id,
			parcelBoxTypeId: mediumParcelBoxType.id,
			parcelBoxRepository,
			cellRepository,
		})

		// Try to get created parcel boxes
		const getMyParcelBoxesQuery = queries.parcelBox.getMine()
		const [getMyParcel] = await makeGraphQLReqWithTokens({
			app,
			query: getMyParcelBoxesQuery,
			accessTokenStr: accessToken.value,
			mainConfig,
		})
		const getMyParcelData = getMyParcel.data[RouteNames.PARCEL_BOX.GET_MINE]

		// Check parcel boxes data structure
		getMyParcelData.forEach(parcelBoxUtils.checkParcelBoxObject)

		// Check that there are only 2 elements in the array
		expect(getMyParcelData.length).toBe(2)

		// Check that created parcel boxes has the same parcelBoxTypeId from which they were created
		expect(getMyParcelData[0].parcelBoxTypeId).toBe(smallParcelBoxType.id)
		expect(getMyParcelData[1].parcelBoxTypeId).toBe(mediumParcelBoxType.id)
	})
})
