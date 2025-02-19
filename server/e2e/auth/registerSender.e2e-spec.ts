import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/email-adapter/email-adapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../helper'
import { defSenderEmail, defSenderPassword, extractErrObjFromResp } from '../utils/common'
import { createApp } from '../utils/createMainApp'

describe.skip('Register a sender (e2e)', () => {
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
		const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_SENDER}(input: {
				email: "johnexample.com",
				password: "my"
			  }) {
				id
				email
				firstName
				lastName
				passportNum
				balance
				active
			  }
			}`

		const createAdminResp = await makeGraphQLReq(app, mutation)

		expect(createAdminResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createAdminResp)

		expect(firstErr.message).toBe('Wrong input data')

		expect(firstErr.fields).toStrictEqual({
			email: ['The email must match the format example@example.com'],
			password: ['Minimum number of characters is 6'],
		})
	})

	it('should return a created sender', async () => {
		const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_SENDER}(input: {
				email: "${defSenderEmail}",
				password: "${defSenderPassword}"
			  }) {
				id
				email
				firstName
				lastName
				passportNum
				balance
				active
			  }
			}`

		const createSenderResp = await makeGraphQLReq(app, mutation)

		expect(emailAdapter.sendEmailConfirmationMessage).toBeCalledTimes(1)

		expect(createSenderResp.data).toStrictEqual({
			[RouteNames.AUTH.REGISTER_SENDER]: {
				id: 1,
				email: defSenderEmail,
				firstName: null,
				lastName: null,
				passportNum: null,
				balance: 0,
				active: false,
			},
		})

		const senderId = createSenderResp.data[RouteNames.AUTH.REGISTER_SENDER].id
		const createdUser = await userQueryRepository.getUserById(senderId)
		expect(createdUser).toEqual({ id: 1, email: defSenderEmail })
	})

	it('should return error if a sender is already created, but his email is not confirmed', async () => {
		const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_SENDER}(input: {
				email: "${defSenderEmail}",
				password: "${defSenderPassword}"
			  }) {
				id
				email
				firstName
				lastName
				passportNum
				balance
				active
			  }
			}`

		await makeGraphQLReq(app, mutation)
		const createAdminResp2 = await makeGraphQLReq(app, mutation)

		const firstErr = extractErrObjFromResp(createAdminResp2)

		expect(firstErr.message).toBe('Email is not confirmed')
		expect(firstErr.code).toBe(400)
	})

	it('should return error if the sender is already created and his email is confirmed', async () => {
		const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_SENDER}(input: {
				email: "${defSenderEmail}",
				password: "${defSenderPassword}"
			  }) {
				id
				email
				firstName
				lastName
				passportNum
				balance
				active
			  }
			}`

		const createSenderResp1 = await makeGraphQLReq(app, mutation)
		const firstSenderId = createSenderResp1.data[RouteNames.AUTH.REGISTER_SENDER].id
		await userRepository.makeEmailVerified(firstSenderId)

		const createSenderResp2 = await makeGraphQLReq(app, mutation)
		const firstErr = extractErrObjFromResp(createSenderResp2)

		expect(firstErr.message).toBe('Email is already registered')
		expect(firstErr.code).toBe(400)
	})
})
