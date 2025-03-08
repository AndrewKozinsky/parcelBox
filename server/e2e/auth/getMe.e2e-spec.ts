import { INestApplication } from '@nestjs/common'
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
import {
	defAdminEmail,
	defAdminPassword,
	defSenderEmail,
	defSenderPassword,
	seedInitDataInDatabase,
} from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../../src/features/test/queries'
import { seedTestData } from '../utils/seedData'
import { userUtils } from '../utils/userUtils'

describe.skip('Get me (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let devicesRepository: DevicesRepository
	let jwtAdapterService: JwtAdapterService
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
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		devicesRepository = await app.resolve(DevicesRepository)
		jwtAdapterService = await app.resolve(JwtAdapterService)
		mainConfig = await app.resolve(MainConfigService)
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeQueryRepository)
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
			cellTypeRepository,
			parcelBoxTypeRepository,
		})
		jest.clearAllMocks()
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
			role: UserRole.Admin,
		})
	})

	it('should return an admin if passed access token is valid', async () => {
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

		const getMeQuery = queries.auth.getMe()
		const [getMeResp, cookies] = await makeGraphQLReqWithTokens({
			app,
			query: getMeQuery,
			accessTokenStr: accessToken.value,
			mainConfig,
		})

		expect(getMeResp.data[RouteNames.AUTH.GET_ME]).toStrictEqual({ id: 9, email: defAdminEmail, role: 'admin' })
	})

	it('should return a sender if passed access token is valid', async () => {
		const { loginData, accessToken, refreshToken } = await userUtils.createUserAndLogin({
			app,
			userRepository,
			role: UserRole.Sender,
			email: defSenderEmail,
			password: defSenderPassword,
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

		expect(getMeResp.data[RouteNames.AUTH.GET_ME]).toStrictEqual({
			id: 9,
			email: defSenderEmail,
			firstName: null,
			lastName: null,
			passportNum: null,
			balance: 0,
			active: false,
			role: 'sender',
		})
	})
})
