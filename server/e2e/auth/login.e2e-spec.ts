import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../utils/queries'
import { userUtils } from '../utils/userUtils'

describe.skip('Confirm an user email (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp(emailAdapter)

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
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
			message: 'Wrong input data',
			fields: {
				email: ['The email must match the format example@mail.com'],
				password: ['Minimum number of characters is 6'],
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
			message: 'Email or passwords do not match',
		})
	})

	it('should return error if email is not confirmed', async () => {
		const admin = await userUtils.createAdminWithUnconfirmedEmail({
			app,
			userRepository,
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
			message: 'Email is not confirmed',
		})
	})

	it('should return 200 if dto has correct values and email is confirmed', async () => {
		const admin = await userUtils.createAdminWithConfirmedEmail({
			app,
			userRepository,
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
