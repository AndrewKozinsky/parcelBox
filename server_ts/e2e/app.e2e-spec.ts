import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'

describe('AppController (e2e)', () => {
	let app: INestApplication<App>

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('should return created administrator', async () => {
		const mutation = `mutation {
		  registerAdmin(input: {
			name: "My NAME",
			email: "myEmail",
			password: "myPass"
		  }) {
			id
			name
			email
			password
		  }
		}`

		const response = await request(app.getHttpServer()).post('/graphql').send({ query: mutation })
		const data = response.body.data

		expect(data).toStrictEqual({
			registerAdmin: {
				id: '2',
				name: 'My NAME',
				email: 'myEmail',
				password: 'myPass',
			},
		})
	})
})
