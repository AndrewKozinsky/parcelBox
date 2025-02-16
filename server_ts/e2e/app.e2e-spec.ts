import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'
import { applyAppSettings } from '../src/infrastructure/applyAppSettings'
import RouteNames from '../src/infrastructure/routeNames'
import { makeGraphQLReq } from './helper'

describe('Auth (e2e)', () => {
	let app: INestApplication<App>

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		applyAppSettings(app)
		await app.init()
	})

	describe('Create administrator', () => {
		it('should return error if wrong data was passed', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				name: "John",
				email: "johnexample.com",
				password: "my"
			  }) {
				id
				name
				email
				password
			  }
			}`

			const createAdminResp = await makeGraphQLReq(app, mutation)
			const { errors, data } = createAdminResp

			expect(data).toBe(null)

			expect(errors[0].message).toBe('Wrong input data')

			expect(errors[0].fields).toStrictEqual({
				email: ['email must be an email'],
				password: ['password must be longer than or equal to 4 characters'],
			})
		})

		it('should return created administrator', async () => {
			const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				name: "John",
				email: "johne@xample.com",
				password: "myPass"
			  }) {
				id
				name
				email
				password
			  }
			}`

			const createAdminResp = await makeGraphQLReq(app, mutation)

			expect(createAdminResp.data).toStrictEqual({
				[RouteNames.AUTH.REGISTER_ADMIN]: {
					id: '2',
					name: 'John',
					email: 'johne@xample.com',
					password: 'myPass',
				},
			})
		})
	})
})
