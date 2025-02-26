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
import { makeGraphQLReq, makeGraphQLReqWithTokens } from '../makeGQReq'
import { authUtils } from '../utils/authUtils'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../utils/queries'
import { userUtils } from '../utils/userUtils'

describe('Get me (e2e)', () => {
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

	it('should return 401 if there is not access device token cookie', async () => {
		await authUtils.accessTokenChecks.tokenNotExist(app, queries.auth.getMe())
	})

	it('should return 401 if the JWT accessToken inside cookie is expired', async () => {
		await authUtils.accessTokenChecks.tokenExpired({
			app,
			queryOrMutationStr: queries.auth.getMe(),
			userRepository,
			devicesRepository,
			jwtAdapter: jwtAdapterService,
			mainConfig,
		})
	})

	it.only('should gives success answer if the accessToken is valid', async () => {
		const { loginData, accessToken, refreshToken } = await userUtils.createAdminAndLogin({
			app,
			userRepository,
			email: defAdminEmail,
			password: defAdminPassword,
		})

		if (!loginData || !accessToken) {
			throw new Error('Unable to login user')
		}

		const getMeQuery = queries.auth.getMe()
		const [getMeResp, cookies] = await makeGraphQLReqWithTokens({
			app,
			query: getMeQuery,
			accessTokenStr: accessToken.value,
			mainConfig,
		})
		console.log(getMeResp.data)

		// expect(getMeResp.data[RouteNames.AUTH.LOGOUT]).toBe(true)

		// Check if refresh token in cookie is already expired
		// const clearedRefreshToken = cookies[mainConfig.get().refreshToken.name]
		// const clearedRefreshTokenExpiredDate = new Date(clearedRefreshToken.expires)
		// expect(+clearedRefreshTokenExpiredDate <= +new Date()).toBe(true)

		// Check if refresh token doesn't exist in database
		// const userDevices = await devicesRepository.getDevicesByUserId(loginData.id)
		// expect(userDevices.length).toBe(0)

		// Check if I cannot log in with old or new accessToken!
		// Do it later when you get a route which requires access token.
	})
})
