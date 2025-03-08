import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellRepository } from '../../src/repo/cell.repository'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { ParcelBoxQueryRepository } from '../../src/repo/parcelBox.queryRepository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeQueryRepository } from '../../src/repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp, seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../../src/features/test/queries'
import { seedTestData } from '../utils/seedData'
import { userUtils } from '../utils/userUtils'

describe.skip('Confirm an user email (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
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

	it('should return error if incorrect email and password was sent', async () => {
		const loginQuery = queries.auth.login({ email: 'wrongemail.com', password: '123' })
		const [loginResp] = await makeGraphQLReq(app, loginQuery)
		const firstErr = extractErrObjFromResp(loginResp)

		expect(loginResp.data).toBe(null)

		expect(firstErr).toStrictEqual({
			code: 400,
			message: errorMessage.wrongInputData,
			fields: {
				email: ['The email must match the format example@mail.com'],
				password: [errorMessage.minCharacters(6)],
			},
		})
	})

	it('should return 400 if email and password does not match', async () => {
		const loginQuery = queries.auth.login({ email: 'wrong@email.com', password: '123456' })
		const [loginResp] = await makeGraphQLReq(app, loginQuery)
		const firstErr = extractErrObjFromResp(loginResp)

		expect(loginResp.data).toBe(null)

		expect(firstErr).toStrictEqual({
			code: 400,
			message: errorMessage.emailOrPasswordDoNotMatch,
		})
	})

	it('should return error if email is not confirmed', async () => {
		const admin = await userUtils.createUserWithUnconfirmedEmail({
			app,
			userRepository,
			role: UserRole.Admin,
			email: defAdminEmail,
			password: defAdminPassword,
		})
		if (!admin) return

		const loginQuery = queries.auth.login({ email: defAdminEmail, password: defAdminPassword })
		const [loginResp] = await makeGraphQLReq(app, loginQuery)

		expect(loginResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(loginResp)

		expect(firstErr).toStrictEqual({
			code: 400,
			message: errorMessage.emailIsNotConfirmed,
		})
	})

	it('should return 200 if dto has correct values and email is confirmed', async () => {
		const admin = await userUtils.createUserWithConfirmedEmail({
			app,
			userRepository,
			role: UserRole.Admin,
			email: defAdminEmail,
			password: defAdminPassword,
		})
		if (!admin) return

		const loginQuery = queries.auth.login({ email: defAdminEmail, password: defAdminPassword })
		const [loginResp, loginRespCookies] = await makeGraphQLReq(app, loginQuery)

		const loginRespData = loginResp.data[RouteNames.AUTH.LOGIN]
		userUtils.checkUserOutModel(loginRespData)

		const { accessToken, refreshToken } = loginRespCookies
		expect(typeof accessToken.value).toBe('string')
		expect(typeof refreshToken.value).toBe('string')
	})
})
