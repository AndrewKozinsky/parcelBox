import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../src/db/clearDB'
import { EmailAdapterService } from '../src/infrastructure/email-adapter/email-adapter.service'
import RouteNames from '../src/infrastructure/routeNames'
import { UserRepository } from '../src/repo/user.repository'
import { makeGraphQLReq } from './helper'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp } from './utils/common'
import { createApp } from './utils/createMainApp'

describe('Auth (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp(emailAdapter)

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('Register administrator', () => {
		it('should return error if wrong data was passed', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "johnexample.com",
				password: "my"
			  }) {
				id
				email
			  }
			}`

			const createAdminResp = await makeGraphQLReq(app, mutation)

			expect(createAdminResp.data).toBe(null)

			const firstErr = extractErrObjFromResp(createAdminResp)
			expect(firstErr.message).toBe('Wrong input data')

			expect(firstErr.fields).toStrictEqual({
				email: ['The email must match the format example@example.com'],
				password: ['password must be longer than or equal to 4 characters'],
			})
		})

		it('should return created administrator', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "${defAdminEmail}",
				password: "${defAdminPassword}"
			  }) {
				id
				email
			  }
			}`

			const createAdminResp = await makeGraphQLReq(app, mutation)

			expect(emailAdapter.sendEmailConfirmationMessage).toBeCalledTimes(1)

			expect(createAdminResp.data).toStrictEqual({
				[RouteNames.AUTH.REGISTER_ADMIN]: {
					id: 1,
					email: defAdminEmail,
				},
			})
		})

		it('should return error if administrator is already created, but email is not confirmed', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "${defAdminEmail}",
				password: "${defAdminPassword}"
			  }) {
				id
				email
			  }
			}`

			await makeGraphQLReq(app, mutation)
			const createAdminResp2 = await makeGraphQLReq(app, mutation)

			const firstErr = extractErrObjFromResp(createAdminResp2)

			expect(firstErr.message).toBe('Email is not confirmed')
			expect(firstErr.code).toBe(400)
		})

		it.only('should return error if administrator is already created and email is confirmed', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "${defAdminEmail}",
				password: "${defAdminPassword}"
			  }) {
				id
				email
			  }
			}`

			const createAdminResp1 = await makeGraphQLReq(app, mutation)
			const firstAdminId = createAdminResp1.data.auth_RegisterAdmin.id
			await userRepository.makeEmailVerified(firstAdminId)

			const createAdminResp2 = await makeGraphQLReq(app, mutation)
			const firstErr = extractErrObjFromResp(createAdminResp2)

			expect(firstErr.message).toBe('Email is already registered')
			expect(firstErr.code).toBe(400)
		})
	})
})
