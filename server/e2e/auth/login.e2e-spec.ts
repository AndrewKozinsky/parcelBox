import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../helper'
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

	it('should return error if wrong confirmation code was passed', async () => {
		const confirmEmailQuery = queries.auth.confirmEmail('')
		// const confirmEmailResp = await makeGraphQLReq(app, query)
		// expect(confirmEmailResp.data).toBe(null)
		// const firstErr = extractErrObjFromResp(confirmEmailResp)
		// expect(firstErr.message).toBe('Email confirmation code not found')
		// expect(firstErr.code).toBe(400)
	})

	// ------

	/*it('should return 400 if dto has incorrect values', async () => {
		const loginRes = await postRequest(mainApp, RouteNames.AUTH.LOGIN.full).expect(
			HTTP_STATUSES.BAD_REQUEST_400,
		)

		const login = loginRes.body

		checkErrorResponse(login, 400, 'Wrong body')

		expect({}.toString.call(login.wrongFields)).toBe('[object Array]')
		expect(login.wrongFields.length).toBe(2)
		const [emailFieldErrText, passwordFieldErrText] = getFieldInErrorObject(login, [
			'email',
			'password',
		])

		expect(emailFieldErrText).toBe('Email must be a string')
		expect(passwordFieldErrText).toBe('Password must be a string')
	})*/

	/*it('should return 400 if email and password does not match', async () => {
		const user = await userUtils.createUserWithConfirmedEmail({
			mainApp,
			filesMicroservice,
			userRepository,
		})

		const loginRes = await postRequest(mainApp, RouteNames.AUTH.LOGIN.full)
			.send({ password: 'mywrongpassword', email: defUserEmail })
			.expect(HTTP_STATUSES.BAD_REQUEST_400)

		const login = loginRes.body

		checkErrorResponse(login, 400, 'Email or passwords do not match')
	})*/

	/*it('should return 403 if email is not confirmed', async () => {
		const user = await userUtils.createUserWithUnconfirmedEmail({
			mainApp,
			userRepository,
			filesMicroservice,
		})

		const loginRes = await postRequest(mainApp, RouteNames.AUTH.LOGIN.full)
			.send({ password: defUserPassword, email: defUserEmail })
			.expect(HTTP_STATUSES.FORBIDDEN_403)

		const login = loginRes.body
		checkErrorResponse(login, 403, 'Email is not confirmed')
	})*/

	/*it('should return 200 if dto has correct values and email is confirmed', async () => {
		const user = await userUtils.createUserWithConfirmedEmail({
			mainApp,
			filesMicroservice,
			userRepository,
		})

		const loginRes = await postRequest(mainApp, RouteNames.AUTH.LOGIN.full)
			.send({ password: defUserPassword, email: defUserEmail })
			.expect(HTTP_STATUSES.OK_200)

		const login = loginRes.body
		checkSuccessResponse(login, 200)

		expect(typeof login.data.accessToken).toBe('string')
		userUtils.checkUserOutModel(login.data.user)
	})*/
})
