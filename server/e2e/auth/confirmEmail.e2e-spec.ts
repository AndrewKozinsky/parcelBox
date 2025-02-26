import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
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

	it('should return error if wrong confirmation code was passed', async () => {
		const confirmEmailQuery = queries.auth.confirmEmail('123')

		const [confirmEmailResp] = await makeGraphQLReq(app, confirmEmailQuery)

		expect(confirmEmailResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(confirmEmailResp)

		expect(firstErr).toEqual({
			code: 400,
			message: 'Email confirmation code not found',
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(0)
	})

	it('should return success if email successfully confirmed', async () => {
		const createdAdmin = await userUtils.createUserWithUnconfirmedEmail({
			userRepository,
			app,
			role: UserRole.Admin,
		})
		if (!createdAdmin) return

		const { emailConfirmationCode } = createdAdmin

		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)

		const [confirmEmailResp] = await makeGraphQLReq(app, confirmEmailQuery)
		expect(confirmEmailResp.data).toStrictEqual({
			[RouteNames.AUTH.CONFIRM_EMAIL]: true,
		})

		const updatedUser = await userRepository.getUserById(createdAdmin.id)
		if (!updatedUser) return

		expect(userUtils.isUserEmailConfirmed(updatedUser)).toBe(true)

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(1)
	})

	it('should return error if email verification allowed time is over', async () => {
		const createdAdmin = await userUtils.createUserWithUnconfirmedEmail({
			userRepository,
			app,
			role: UserRole.Admin,
		})
		if (!createdAdmin) return

		// Change email confirmation allowed time to past
		await userRepository.updateUser(createdAdmin!.id, {
			email_confirmation_code_expiration_date: new Date().toISOString(),
		})

		const { emailConfirmationCode } = createdAdmin

		// Try to confirm email
		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)

		const [confirmEmailResp] = await makeGraphQLReq(app, confirmEmailQuery)
		const firstErr = extractErrObjFromResp(confirmEmailResp)

		expect(firstErr).toEqual({
			code: 400,
			message: 'Email confirmation code is expired',
		})

		// Check the user's email is still unconfirmed
		const thisUser = await userRepository.getUserById(createdAdmin.id)
		if (!thisUser) return

		expect(userUtils.isUserEmailConfirmed(thisUser)).toBe(false)
	})

	it('should return 400 if they try to confirm email the second time', async () => {
		const createdAdmin = await userUtils.createUserWithUnconfirmedEmail({
			userRepository,
			app,
			role: UserRole.Admin,
		})
		if (!createdAdmin) return

		const { emailConfirmationCode } = createdAdmin

		// Try to confirm email
		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)

		const [confirmEmailResp] = await makeGraphQLReq(app, confirmEmailQuery)
		expect(confirmEmailResp.data).toStrictEqual({
			[RouteNames.AUTH.CONFIRM_EMAIL]: true,
		})

		// Try to confirm email second time
		const [confirmEmailResp2] = await makeGraphQLReq(app, confirmEmailQuery)
		const firstErr = extractErrObjFromResp(confirmEmailResp2)

		expect(firstErr).toEqual({
			code: 400,
			message: 'Email confirmation code not found',
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(1)
	})
})
