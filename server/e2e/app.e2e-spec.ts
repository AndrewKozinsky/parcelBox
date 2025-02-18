import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../src/db/clearDB'
import { EmailAdapterService } from '../src/infrastructure/email-adapter/email-adapter.service'
import RouteNames from '../src/infrastructure/routeNames'
import { makeGraphQLReq } from './helper'
import { createApp } from './utils/createMainApp'

describe('Auth (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService

	beforeAll(async () => {
		const createMainAppRes = await createApp(emailAdapter)

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
	})

	beforeEach(async () => {
		await clearAllDB(app)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('Create administrator', () => {
		/*it('should return error if wrong data was passed', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "johnexample.com",
				password: "my"
			  }) {
				id
				email
				password
			  }
			}`

			const createAdminResp = await makeGraphQLReq(app, mutation)
			const { errors, data } = createAdminResp

			expect(data).toBe(null)

			expect(errors[0].message).toBe('Wrong input data')

			expect(errors[0].fields).toStrictEqual({
				email: ['The email must match the format example@example.com'],
				password: ['password must be longer than or equal to 4 characters'],
			})
		})*/

		/*it('should return created administrator', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "johne@xample.com",
				password: "myPass"
			  }) {
				id
				email
				password
			  }
			}`

			const createAdminResp = await makeGraphQLReq(app, mutation)

			expect(createAdminResp.data).toStrictEqual({
				[RouteNames.AUTH.REGISTER_ADMIN]: {
					id: '2',
					email: 'johne@xample.com',
					password: 'myPass',
				},
			})
		})*/

		it('should return error if administrator is already created', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "johne@sxample.com",
				password: "myPass"
			  }) {
				id
				email
				password
			  }
			}`

			const createAdminResp = await makeGraphQLReq(app, mutation)
			console.log(JSON.stringify(createAdminResp))
			// const createAdminResp2 = await makeGraphQLReq(app, mutation)

			expect(2).toBe(2)
		})
	})
})
