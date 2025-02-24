import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { MainConfigService } from '../../src/config/mainConfig.service'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { JwtAdapterService } from '../../src/infrastructure/jwtAdapter/jwtAdapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { DevicesRepository } from '../../src/repo/devices.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq, makeGraphQLReqWithRefreshToken } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../utils/queries'
import { userUtils } from '../utils/userUtils'

describe.skip('Get new refresh and access tokens (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let devicesRepository: DevicesRepository
	let jwtAdapterService: JwtAdapterService
	let mainConfig: MainConfigService

	beforeAll(async () => {
		const createMainAppRes = await createApp(emailAdapter)

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		devicesRepository = await app.resolve(DevicesRepository)
		jwtAdapterService = await app.resolve(JwtAdapterService)
		mainConfig = await app.resolve(MainConfigService)
	})

	beforeEach(async () => {
		await clearAllDB(app)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return 401 if there is not refresh device token cookie', async () => {
		await userUtils.refreshDeviceTokenChecks.tokenNotExist(app, queries.auth.getNewAccessAndRefreshTokens())
	})

	it('should return 401 if the JWT refreshToken inside cookie is expired', async () => {
		await userUtils.refreshDeviceTokenChecks.refreshTokenExpired({
			app,
			queryOrMutationStr: queries.auth.getNewAccessAndRefreshTokens(),
			userRepository,
			devicesRepository,
			jwtAdapterService,
			mainConfig,
		})
	})

	it('should gives success answer if the JWT refreshToken is valid', async () => {
		const { loginData, accessToken, refreshToken } = await userUtils.createAdminAndLogin({
			app,
			userRepository,
			email: defAdminEmail,
			password: defAdminPassword,
		})

		const updateTokensMutation = queries.auth.getNewAccessAndRefreshTokens()
		const [updateTokensResp, cookies] = await makeGraphQLReqWithRefreshToken({
			app,
			query: updateTokensMutation,
			refreshTokenStr: refreshToken?.value,
			mainConfig,
		})

		expect(updateTokensResp.data[RouteNames.AUTH.GET_NEW_ACCESS_AND_REFRESH_TOKENS]).toBe(true)

		// TODO Check if new access and refresh tokens are valid...
	})
})
