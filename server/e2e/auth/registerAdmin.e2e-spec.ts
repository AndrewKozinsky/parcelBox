import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp, seedDbWithTestData } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../utils/queries'

describe.skip('Register an administrator (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
		await seedDbWithTestData({ app, userRepository })
		jest.clearAllMocks()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return error if wrong data was passed', async () => {
		const registerAdminMutation = queries.auth.registerAdmin({ email: 'johnexample.com', password: 'my' })

		const [createAdminResp] = await makeGraphQLReq(app, registerAdminMutation)

		expect(createAdminResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createAdminResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.wrongInputData,
			code: 400,
			fields: {
				email: ['The email must match the format example@mail.com'],
				password: [errorMessage.minNumberOfCharacters(6)],
			},
		})
	})

	it('should create a new administrator', async () => {
		const registerAdminMutation = queries.auth.registerAdmin({ email: defAdminEmail, password: defAdminPassword })

		const [createAdminResp] = await makeGraphQLReq(app, registerAdminMutation)

		// Check if a confirmation letter was sent
		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(1)

		// Check returned object
		expect(createAdminResp.data).toStrictEqual({
			[RouteNames.AUTH.REGISTER_ADMIN]: {
				id: 9,
				email: defAdminEmail,
				role: 'admin',
			},
		})

		// Find created admin in the database
		const adminId = createAdminResp.data[RouteNames.AUTH.REGISTER_ADMIN].id
		const createdUser = await userQueryRepository.getUserById(adminId)
		expect(createdUser).toStrictEqual({ id: 1, email: defAdminEmail, role: 'admin' })
	})

	it('should return error if administrator is already created, but email is not confirmed', async () => {
		const registerAdminMutation = queries.auth.registerAdmin({ email: defAdminEmail, password: defAdminPassword })

		await makeGraphQLReq(app, registerAdminMutation)
		const [createAdminResp2] = await makeGraphQLReq(app, registerAdminMutation)

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(1)

		const firstErr = extractErrObjFromResp(createAdminResp2)

		expect(firstErr).toStrictEqual({
			code: 400,
			message: errorMessage.emailIsNotConfirmed,
		})
	})

	it('should return error if administrator is already created and email is confirmed', async () => {
		const registerAdminMutation = queries.auth.registerAdmin({ email: defAdminEmail, password: defAdminPassword })

		const [createAdminResp1] = await makeGraphQLReq(app, registerAdminMutation)
		const firstAdminId = createAdminResp1.data[RouteNames.AUTH.REGISTER_ADMIN].id
		await userRepository.makeEmailVerified(firstAdminId)

		const [createAdminResp2] = await makeGraphQLReq(app, registerAdminMutation)
		const firstErr = extractErrObjFromResp(createAdminResp2)

		expect(firstErr).toStrictEqual({
			code: 400,
			message: errorMessage.emailIsAlreadyRegistered,
		})
	})
})
