import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { JwtAdapterService } from '../../src/infrastructure/jwtAdapter/jwtAdapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { DevicesRepository } from '../../src/repo/devices.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq, makeGraphQLReqWithTokens } from '../makeGQReq'
import { authUtils } from '../utils/authUtils'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp, seedDbWithTestData } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../utils/queries'
import { userUtils } from '../utils/userUtils'

describe.skip('Logout (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let devicesRepository: DevicesRepository
	let jwtAdapter: JwtAdapterService
	let mainConfig: MainConfigService

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		devicesRepository = await app.resolve(DevicesRepository)
		jwtAdapter = await app.resolve(JwtAdapterService)
		mainConfig = await app.resolve(MainConfigService)
	})

	beforeEach(async () => {
		await clearAllDB(app)
		await seedDbWithTestData({ app, userRepository })
		jest.clearAllMocks()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return 401 if there is not refresh device token cookie', async () => {
		await authUtils.refreshDeviceTokenChecks.tokenNotExist(app, queries.auth.logout())
	})

	it('should return 401 if the JWT refreshToken inside cookie is expired', async () => {
		await authUtils.refreshDeviceTokenChecks.tokenExpired({
			app,
			queryOrMutationStr: queries.auth.logout(),
			userRepository,
			devicesRepository,
			jwtAdapter,
			mainConfig,
			role: UserRole.Admin,
		})
	})

	it('should gives success answer if the JWT refreshToken is valid', async () => {
		const { loginData, accessToken, refreshToken } = await userUtils.createUserAndLogin({
			app,
			userRepository,
			role: UserRole.Admin,
			email: defAdminEmail,
			password: defAdminPassword,
		})

		const logoutMutation = queries.auth.logout()
		const [logoutResp, cookies] = await makeGraphQLReqWithTokens({
			app,
			query: logoutMutation,
			refreshTokenStr: refreshToken?.value,
			mainConfig,
		})

		expect(logoutResp.data[RouteNames.AUTH.LOGOUT]).toBe(true)

		// Check if refresh token in cookie is already expired
		const clearedRefreshToken = cookies[mainConfig.get().refreshToken.name]
		const clearedRefreshTokenExpiredDate = new Date(clearedRefreshToken.expires)
		expect(+clearedRefreshTokenExpiredDate <= +new Date()).toBe(true)

		// Check if refresh token doesn't exist in database
		const userDevices = await devicesRepository.getDevicesByUserId(loginData.id)
		expect(userDevices.length).toBe(0)

		// Check if I cannot log in with old or new accessToken!
		// Do it later when you get a route which requires access token.
	})
})
