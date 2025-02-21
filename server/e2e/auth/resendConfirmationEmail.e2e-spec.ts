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

	it('should return error if input has incorrect values', async () => {
		const resendConfirmationEmailMutation = queries.auth.resendConfirmationEmail('johnexample.com')
		const resendConfirmationEmailResp = await makeGraphQLReq(app, resendConfirmationEmailMutation)

		const firstErr = extractErrObjFromResp(resendConfirmationEmailResp)

		expect(firstErr).toStrictEqual({
			message: 'Wrong input data',
			code: 400,
			fields: {
				email: ['The email must match the format example@mail.com'],
			},
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toBeCalledTimes(0)
	})

	it('should return an error if the entered email is not exists', async () => {
		const resendConfirmationEmailMutation = queries.auth.resendConfirmationEmail('john@example.com')
		const resendConfirmationEmailResp = await makeGraphQLReq(app, resendConfirmationEmailMutation)

		const firstErr = extractErrObjFromResp(resendConfirmationEmailResp)

		expect(firstErr).toStrictEqual({
			message: 'Email is not found',
			code: 400,
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toBeCalledTimes(0)
	})

	it('should return success if input has correct values', async () => {
		const admin = await userUtils.createAdminWithUnconfirmedEmail({
			app,
			userRepository,
			email: defAdminEmail,
			password: defAdminPassword,
		})
		if (!admin) return

		const resendConfirmationEmailMutation = queries.auth.resendConfirmationEmail(admin.email)
		const resendConfirmationEmailResp = await makeGraphQLReq(app, resendConfirmationEmailMutation)

		expect(resendConfirmationEmailResp.data).toBeTruthy()

		expect(emailAdapter.sendEmailConfirmationMessage).toBeCalledTimes(1)
	})

	it('should return an error if email is already confirmed', async () => {
		const admin = await userUtils.createAdminWithConfirmedEmail({
			app,
			userRepository,
			email: defAdminEmail,
			password: defAdminPassword,
		})
		if (!admin) return

		const resendConfirmationEmailMutation = queries.auth.resendConfirmationEmail(admin.email)
		const resendConfirmationEmailResp = await makeGraphQLReq(app, resendConfirmationEmailMutation)

		const firstErr = extractErrObjFromResp(resendConfirmationEmailResp)

		expect(firstErr).toStrictEqual({
			message: 'Email is already confirmed',
			code: 400,
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toBeCalledTimes(1)
	})
})
