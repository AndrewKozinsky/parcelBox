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
import { makeGraphQLReq } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../utils/queries'
import { userUtils } from '../utils/userUtils'

describe('Logout (e2e)', () => {
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

	it('should return 401 if there is not device token cookie', async () => {
		await userUtils.deviceTokenChecks.tokenNotExist(app, queries.auth.logout())
	})

	it.only('should return 401 if the JWT refreshToken inside cookie is missing, expired or incorrect', async () => {
		await userUtils.deviceTokenChecks.refreshTokenExpired({
			app,
			queryOrMutationStr: queries.auth.logout(),
			userRepository,
			devicesRepository,
			jwtAdapterService,
			mainConfig,
		})
	})

	/*it('should return 200 if the JWT refreshToken inside cookie is valid', async () => {
		const [accessToken, refreshTokenStr] = await userUtils.createUserAndLogin({
			mainApp,
			filesMicroservice,
			userRepository,
			userName: defUserName,
			email: defUserEmail,
			password: defUserPassword,
		})

		const refreshTokenValue = parseCookieStringToObj(refreshTokenStr).cookieValue

		await postRequest(mainApp, RouteNames.AUTH.LOGOUT.full)
			.set('authorization', 'Bearer ' + accessToken)
			.set('Cookie', mainConfig.get().refreshToken.name + '=' + refreshTokenValue)
			.expect(HTTP_STATUSES.OK_200)
	})*/
})
