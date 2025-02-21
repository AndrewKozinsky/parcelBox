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

describe.skip('Register an administrator (e2e)', () => {
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

	it('should return error if wrong data was passed', async () => {
		const registerAdminMutation = queries.auth.registerAdmin({ email: 'johnexample.com', password: 'my' })

		const createAdminResp = await makeGraphQLReq(app, registerAdminMutation)

		expect(createAdminResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createAdminResp)

		expect(firstErr).toStrictEqual({
			message: 'Wrong input data',
			fields: {
				email: ['The email must match the format example@mail.com'],
				password: ['Minimum number of characters is 6'],
			},
		})
	})

	it('should return created administrator', async () => {
		const registerAdminMutation = queries.auth.registerAdmin({ email: defAdminEmail, password: defAdminPassword })

		const createAdminResp = await makeGraphQLReq(app, registerAdminMutation)

		expect(emailAdapter.sendEmailConfirmationMessage).toBeCalledTimes(1)

		expect(createAdminResp.data).toStrictEqual({
			[RouteNames.AUTH.REGISTER_ADMIN]: {
				id: 1,
				email: defAdminEmail,
			},
		})

		const adminId = createAdminResp.data[RouteNames.AUTH.REGISTER_ADMIN].id
		const createdUser = await userQueryRepository.getUserById(adminId)
		expect(createdUser).toEqual({ id: 1, email: defAdminEmail })
	})

	it('should return error if administrator is already created, but email is not confirmed', async () => {
		const registerAdminMutation = queries.auth.registerAdmin({ email: defAdminEmail, password: defAdminPassword })

		await makeGraphQLReq(app, registerAdminMutation)
		const createAdminResp2 = await makeGraphQLReq(app, registerAdminMutation)

		const firstErr = extractErrObjFromResp(createAdminResp2)

		expect(firstErr.message).toBe('Email is not confirmed')
		expect(firstErr.code).toBe(400)
	})

	it('should return error if administrator is already created and email is confirmed', async () => {
		const registerAdminMutation = queries.auth.registerAdmin({ email: defAdminEmail, password: defAdminPassword })

		const createAdminResp1 = await makeGraphQLReq(app, registerAdminMutation)
		const firstAdminId = createAdminResp1.data[RouteNames.AUTH.REGISTER_ADMIN].id
		await userRepository.makeEmailVerified(firstAdminId)

		const createAdminResp2 = await makeGraphQLReq(app, registerAdminMutation)
		const firstErr = extractErrObjFromResp(createAdminResp2)

		expect(firstErr.message).toBe('Email is already registered')
		expect(firstErr.code).toBe(400)
	})
})
