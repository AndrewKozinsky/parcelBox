import { INestApplication } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { App } from 'supertest/types'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
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
import { queries } from '../../src/features/test/queries'
import { seedTestData } from '../utils/seedTestData'
import { userUtils } from '../utils/userUtils'
import '../utils/jestExtendFunctions'

describe.skip('Get new refresh and access tokens (e2e)', () => {
	let app: INestApplication<App>
	let commandBus: CommandBus
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let devicesRepository: DevicesRepository
	let jwtAdapter: JwtAdapterService
	let mainConfig: MainConfigService
	let parcelBoxTypeRepository: ParcelBoxTypeRepository
	let parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository
	let cellTypeRepository: CellTypeRepository
	let parcelBoxQueryRepository: ParcelBoxQueryRepository
	let parcelBoxRepository: ParcelBoxRepository
	let cellRepository: CellRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		commandBus = app.get(CommandBus)
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		devicesRepository = await app.resolve(DevicesRepository)
		jwtAdapter = await app.resolve(JwtAdapterService)
		mainConfig = await app.resolve(MainConfigService)
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
		await seedTestData(commandBus)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return 401 if there is not refresh device token cookie', async () => {
		await authUtils.refreshDeviceTokenChecks.tokenNotExist(app, queries.auth.getNewAccessAndRefreshTokens())
	})

	it('should return 401 if the JWT refreshToken inside cookie is expired', async () => {
		await authUtils.refreshDeviceTokenChecks.tokenExpired({
			app,
			queryOrMutationStr: queries.auth.getNewAccessAndRefreshTokens(),
			userRepository,
			devicesRepository,
			jwtAdapter,
			mainConfig,
			role: UserRole.Admin,
		})
	})

	it('should gives success answer if the JWT refreshToken is valid', async () => {
		const loginRes = await userUtils.createUserAndLogin({
			app,
			userRepository,
			role: UserRole.Admin,
			email: defAdminEmail,
			password: defAdminPassword,
		})

		const { loginData, accessToken, refreshToken } = loginRes

		const updateTokensMutation = queries.auth.getNewAccessAndRefreshTokens()
		const [updateTokensResp, cookies] = await makeGraphQLReqWithTokens({
			app,
			query: updateTokensMutation,
			refreshTokenStr: refreshToken?.value,
			mainConfig,
		})

		expect(updateTokensResp.data[RouteNames.AUTH.GET_NEW_ACCESS_AND_REFRESH_TOKENS]).toBe(true)

		// TODO Check if new access and refresh tokens are valid...
	})
})
